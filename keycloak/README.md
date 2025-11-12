### URL
- OpenAPI Docs Learning Service: "http://127.0.0.1:8081/api/v1/swagger-ui/index.html"
- OpenAPI Docs Teaching Service: "http://127.0.0.1:8082/api/v1/swagger-ui/index.html"

***Notes***: 
- Mở API Docs có nút "Authorization" ở góc trên bên phải. Nhấn vào nút đó và nhập thông tin tài khoản vào ô "Name" tương ứng.
- Tuy nhiên, khi gọi thông qua API Gateway thì phải truyền Access Token trong "Authorization" header kiểu Bearer.
- Các API có thể sử dụng và API mẫu cho Security trong file ./keycloak-rest-api.json. Import file này vào Postman để chạy và kiểm thử.
- Các token bên dưới có thể sử dụng để hardcode vì thời gian hết hạn lâu.

---

### Thông tin tài khoản

- tutor X-Remote-User header: "tutor"
- tutor X-Remote-Sub header: "6aa5ed35-91b9-4cd6-80d3-9f4dff25846d"
- tutor X-Remote-Roles header: "TUTOR"

- tutor usename: "tutor"
- tutor password: "tutor" 

---

- student X-Remote-User header: "student"
- student X-Remote-Sub header: "49616e7e-ad5d-4312-83ad-294facc849b2"
- student X-Remote-Roles header: "STUDENT"

- student username: "student"
- student password" "student"

---

- admin X-Remote-User header: "admin"
- admin X-Remote-Sub header: "6aa5ed35-91b9-4cd6-80d3-9f4dff25846d"
- admin X-Remote-Roles header: "ADMIN,STUDENT,TUTOR"

- admin username: "admin"
- admin password: "admin"

---