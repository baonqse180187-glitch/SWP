import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await axios.get('/api/reports/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const modelData = {
    labels: ['EV-2023', 'EV-2024'],
    datasets: [
      {
        label: 'Số lượng claim',
        data: [2, 1],
        backgroundColor: '#667eea',
      },
    ],
  };

  const regionData = {
    labels: ['Miền Bắc', 'Miền Nam'],
    datasets: [
      {
        data: [2, 1],
        backgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><i className="fas fa-chart-bar me-2"></i>Báo cáo & Thống kê</h2>
        <button className="btn btn-primary" onClick={loadReports} style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '25px'
        }}>
          <i className="fas fa-sync me-2"></i>Làm mới
        </button>
      </div>

      <Row>
        <Col md={6} className="mb-4">
          <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
            <Card.Header>
              <h5>Thống kê theo Model</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Bar data={modelData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card style={{ border: 'none', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.08)' }}>
            <Card.Header>
              <h5>Thống kê theo Khu vực</h5>
            </Card.Header>
            <Card.Body>
              <div style={{ height: '400px' }}>
                <Pie data={regionData} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Reports;
