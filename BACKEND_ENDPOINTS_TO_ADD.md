# Backend Endpoints Cần Thêm

## 1. UserController.java
**File:** `EVWarrantyHub/src/main/java/swp391/evwarrantyhub/controller/UserController.java`

**Thêm sau method `resetPassword()`:**

```java
@GetMapping
@PreAuthorize("hasRole('ADMIN')")
public ApiResponse<List<UserResponse>> getAllUsers(
    @RequestParam(required = false) String role
) {
    return userService.getAllUsers(role);
}

@GetMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ApiResponse<UserResponse> getUserById(@PathVariable Integer id) {
    return userService.getUserById(id);
}

@DeleteMapping("/{id}")
@PreAuthorize("hasRole('ADMIN')")
public ApiResponse<String> deleteUser(@PathVariable Integer id) {
    return userService.deleteUser(id);
}
```

**Cần import thêm:**
```java
import java.util.List;
```

---

## 2. UserService.java (Interface)
**File:** `EVWarrantyHub/src/main/java/swp391/evwarrantyhub/service/UserService.java`

**Thêm vào interface:**

```java
ApiResponse<List<UserResponse>> getAllUsers(String role);
ApiResponse<UserResponse> getUserById(Integer id);
ApiResponse<String> deleteUser(Integer id);
```

---

## 3. UserServiceImpl.java (Implementation)
**File:** `EVWarrantyHub/src/main/java/swp391/evwarrantyhub/service/Impl/UserServiceImpl.java`

**Thêm implementations:**

```java
@Override
public ApiResponse<List<UserResponse>> getAllUsers(String role) {
    List<User> users;
    
    if (role != null && !role.isEmpty()) {
        // Filter by role if provided
        users = userRepository.findByRole_RoleName(role);
    } else {
        // Get all users
        users = userRepository.findAll();
    }
    
    List<UserResponse> userResponses = users.stream()
        .map(userMapper::toUserResponse)
        .collect(Collectors.toList());
    
    return ApiResponse.<List<UserResponse>>builder()
        .result(userResponses)
        .build();
}

@Override
public ApiResponse<UserResponse> getUserById(Integer id) {
    User user = userRepository.findById(id)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    
    return ApiResponse.<UserResponse>builder()
        .result(userMapper.toUserResponse(user))
        .build();
}

@Override
public ApiResponse<String> deleteUser(Integer id) {
    // Check if user exists
    if (!userRepository.existsById(id)) {
        throw new AppException(ErrorCode.USER_NOT_EXISTED);
    }
    
    // Delete user
    userRepository.deleteById(id);
    
    return ApiResponse.<String>builder()
        .result("Xóa user thành công")
        .build();
}
```

**Cần import thêm:**
```java
import java.util.List;
import java.util.stream.Collectors;
```

---

## 4. UserRepository.java
**File:** `EVWarrantyHub/src/main/java/swp391/evwarrantyhub/repository/UserRepository.java`

**Kiểm tra xem có method này chưa, nếu chưa thì thêm:**

```java
List<User> findByRole_RoleName(String roleName);
```

---

## Sau khi thêm xong:

1. **Restart backend** (Spring Boot application)
2. **Test endpoints:**
   - GET `http://localhost:8080/api/users` - Lấy tất cả users
   - GET `http://localhost:8080/api/users?role=ADMIN` - Lấy users theo role
   - GET `http://localhost:8080/api/users/1` - Lấy user theo ID
   - DELETE `http://localhost:8080/api/users/1` - Xóa user theo ID

3. **Frontend sẽ tự động hoạt động** sau khi backend có endpoints này!

---

## Frontend đã sẵn sàng:
- ✅ API calls đã được config trong `src/api/index.js`
- ✅ UserManagement component đã ready
- ✅ Chỉ cần backend có endpoints là hoạt động ngay

