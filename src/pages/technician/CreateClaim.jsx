import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch, FaCar, FaTools, FaFileAlt, FaCloudUploadAlt,
    FaCheckCircle, FaArrowRight, FaArrowLeft
} from 'react-icons/fa';
import { vehicleAPI, warrantyClaimAPI } from '../../api';
import styles from './CreateClaim.module.css';

const CreateClaim = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        vehicleVin: '',
        vehicleId: null,
        vehicleInfo: null,
        partType: '',
        partSerialNumber: '',
        issueDescription: '',
        failureDate: '',
        mileage: '',
        attachments: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const steps = [
        { number: 1, title: 'Thông tin xe', icon: FaCar },
        { number: 2, title: 'Phụ tùng lỗi', icon: FaTools },
        { number: 3, title: 'Mô tả chi tiết', icon: FaFileAlt },
        { number: 4, title: 'Tải file', icon: FaCloudUploadAlt }
    ];

    const partTypes = [
        { value: 'BATTERY', label: 'Pin (Battery)' },
        { value: 'MOTOR', label: 'Động cơ (Motor)' },
        { value: 'BMS', label: 'Hệ thống quản lý pin (BMS)' },
        { value: 'INVERTER', label: 'Inverter' },
        { value: 'CHARGER', label: 'Bộ sạc (Charger)' },
        { value: 'CONTROLLER', label: 'Bộ điều khiển' },
        { value: 'OTHER', label: 'Khác' }
    ];

    // Step 1: Vehicle Lookup
    const handleVINSearch = async () => {
        if (!formData.vehicleVin) {
            setError('Vui lòng nhập VIN');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await vehicleAPI.getVehicleByVIN(formData.vehicleVin);
            const vehicle = response.data.result;

            setFormData(prev => ({
                ...prev,
                vehicleId: vehicle.id,
                vehicleInfo: vehicle
            }));

            setCurrentStep(2);
        } catch (err) {
            setError('Không tìm thấy xe hoặc xe không còn trong bảo hành');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Part Selection
    const handlePartNext = () => {
        if (!formData.partType) {
            setError('Vui lòng chọn loại phụ tùng');
            return;
        }
        setError('');
        setCurrentStep(3);
    };

    // Step 3: Description
    const handleDescriptionNext = () => {
        if (!formData.issueDescription || !formData.failureDate) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }
        setError('');
        setCurrentStep(4);
    };

    // Step 4: File Upload & Submit
    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const handleRemoveFile = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError('');

            const claimData = {
                vehicleId: formData.vehicleId,
                partType: formData.partType,
                partSerialNumber: formData.partSerialNumber,
                description: formData.issueDescription,
                failureDate: formData.failureDate,
                mileage: formData.mileage
            };

            const response = await warrantyClaimAPI.createClaim(claimData);
            const claimId = response.data.result.id;

            // Upload attachments
            for (const file of formData.attachments) {
                const formDataFile = new FormData();
                formDataFile.append('file', file);
                await warrantyClaimAPI.uploadAttachment(claimId, formDataFile);
            }

            alert('✅ Tạo yêu cầu bảo hành thành công!');
            navigate(`/technician/claims/${claimId}`);
        } catch (err) {
            setError('Có lỗi xảy ra khi tạo yêu cầu');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Tạo yêu cầu bảo hành mới</h1>
                <p className={styles.subtitle}>Điền đầy đủ thông tin để tạo yêu cầu</p>
            </div>

            {/* Steps Indicator */}
            <div className={styles.stepsIndicator}>
                {steps.map((step) => {
                    const Icon = step.icon;
                    return (
                        <div
                            key={step.number}
                            className={`${styles.stepItem} ${currentStep === step.number ? styles.active :
                                    currentStep > step.number ? styles.completed : ''
                                }`}
                        >
                            <div className={styles.stepIcon}>
                                {currentStep > step.number ? <FaCheckCircle /> : <Icon />}
                            </div>
                            <span className={styles.stepTitle}>{step.title}</span>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div className={styles.errorAlert}>
                    ⚠️ {error}
                </div>
            )}

            {/* Step Content */}
            <div className={styles.formCard}>
                {/* Step 1: Vehicle Search */}
                {currentStep === 1 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>
                            <FaCar /> Tra cứu thông tin xe
                        </h2>

                        <div className={styles.formGroup}>
                            <label>VIN (Vehicle Identification Number)</label>
                            <div className={styles.vinInput}>
                                <input
                                    type="text"
                                    placeholder="Nhập VIN của xe (17 ký tự)"
                                    value={formData.vehicleVin}
                                    onChange={(e) => setFormData({ ...formData, vehicleVin: e.target.value.toUpperCase() })}
                                    maxLength={17}
                                />
                                <button onClick={handleVINSearch} disabled={loading}>
                                    <FaSearch /> {loading ? 'Đang tìm...' : 'Tra cứu'}
                                </button>
                            </div>
                        </div>

                        {formData.vehicleInfo && (
                            <div className={styles.vehicleInfo}>
                                <h3>✓ Thông tin xe</h3>
                                <div className={styles.infoGrid}>
                                    <div>
                                        <span>Model:</span>
                                        <strong>{formData.vehicleInfo.model?.name}</strong>
                                    </div>
                                    <div>
                                        <span>Màu sắc:</span>
                                        <strong>{formData.vehicleInfo.color}</strong>
                                    </div>
                                    <div>
                                        <span>Ngày bảo hành:</span>
                                        <strong>{new Date(formData.vehicleInfo.warrantyStartDate).toLocaleDateString('vi-VN')}</strong>
                                    </div>
                                    <div>
                                        <span>Trạng thái:</span>
                                        <strong className={styles.warrantyActive}>Còn bảo hành</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Part Selection */}
                {currentStep === 2 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>
                            <FaTools /> Chọn phụ tùng bị lỗi
                        </h2>

                        <div className={styles.formGroup}>
                            <label>Loại phụ tùng <span className={styles.required}>*</span></label>
                            <select
                                value={formData.partType}
                                onChange={(e) => setFormData({ ...formData, partType: e.target.value })}
                            >
                                <option value="">-- Chọn loại phụ tùng --</option>
                                {partTypes.map(part => (
                                    <option key={part.value} value={part.value}>{part.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Serial Number phụ tùng (nếu có)</label>
                            <input
                                type="text"
                                placeholder="Nhập S/N của phụ tùng"
                                value={formData.partSerialNumber}
                                onChange={(e) => setFormData({ ...formData, partSerialNumber: e.target.value })}
                            />
                        </div>

                        <div className={styles.navigation}>
                            <button
                                onClick={() => setCurrentStep(1)}
                                className={styles.btnSecondary}
                            >
                                <FaArrowLeft /> Quay lại
                            </button>
                            <button
                                onClick={handlePartNext}
                                className={styles.btnPrimary}
                            >
                                Tiếp tục <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Description */}
                {currentStep === 3 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>
                            <FaFileAlt /> Mô tả chi tiết sự cố
                        </h2>

                        <div className={styles.formGroup}>
                            <label>Mô tả sự cố <span className={styles.required}>*</span></label>
                            <textarea
                                rows={6}
                                placeholder="Mô tả chi tiết hiện tượng hỏng hóc, triệu chứng, kiểm tra đã thực hiện..."
                                value={formData.issueDescription}
                                onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                            />
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label>Ngày phát hiện lỗi <span className={styles.required}>*</span></label>
                                <input
                                    type="date"
                                    value={formData.failureDate}
                                    onChange={(e) => setFormData({ ...formData, failureDate: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Số km đã đi</label>
                                <input
                                    type="number"
                                    placeholder="VD: 5000"
                                    value={formData.mileage}
                                    onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.navigation}>
                            <button
                                onClick={() => setCurrentStep(2)}
                                className={styles.btnSecondary}
                            >
                                <FaArrowLeft /> Quay lại
                            </button>
                            <button
                                onClick={handleDescriptionNext}
                                className={styles.btnPrimary}
                            >
                                Tiếp tục <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Upload Files */}
                {currentStep === 4 && (
                    <div className={styles.stepContent}>
                        <h2 className={styles.stepHeading}>
                            <FaCloudUploadAlt /> Tải lên file đính kèm
                        </h2>

                        <div className={styles.uploadArea}>
                            <input
                                type="file"
                                id="fileUpload"
                                multiple
                                accept="image/*,video/*,.pdf"
                                onChange={handleFileUpload}
                                className={styles.fileInput}
                            />
                            <label htmlFor="fileUpload" className={styles.uploadLabel}>
                                <FaCloudUploadAlt className={styles.uploadIcon} />
                                <p>Kéo thả file hoặc click để chọn</p>
                                <span>Hỗ trợ: Ảnh, Video, PDF (Max 10MB/file)</span>
                            </label>
                        </div>

                        {formData.attachments.length > 0 && (
                            <div className={styles.fileList}>
                                <h4>Đã chọn {formData.attachments.length} file:</h4>
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className={styles.fileItem}>
                                        <span>{file.name}</span>
                                        <button onClick={() => handleRemoveFile(index)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className={styles.navigation}>
                            <button
                                onClick={() => setCurrentStep(3)}
                                className={styles.btnSecondary}
                            >
                                <FaArrowLeft /> Quay lại
                            </button>
                            <button
                                onClick={handleSubmit}
                                className={styles.btnSuccess}
                                disabled={loading}
                            >
                                <FaCheckCircle /> {loading ? 'Đang tạo...' : 'Tạo yêu cầu'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateClaim;
