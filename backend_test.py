#!/usr/bin/env python3
"""
Backend API Testing for CV Build for SEAMAN Application
Testing Payment API and CV Download flow
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "https://maritime-cv.preview.emergentagent.com/api"
ADMIN_EMAIL = "yansen@jesseenergisejahtera.com"
ADMIN_PASSWORD = "123456"

# Test data
SAMPLE_CV_DATA = {
    "personalInfo": {
        "fullName": "Test Captain",
        "title": "Master Mariner",
        "email": "test@test.com",
        "phone": "+1234567890",
        "location": "Jakarta, Indonesia",
        "summary": "Experienced seaman."
    },
    "experience": [
        {
            "position": "Captain",
            "employer": "Test Shipping",
            "location": "Worldwide",
            "startDate": "2020",
            "endDate": "Present",
            "description": ["Led crew of 25"]
        }
    ],
    "education": [
        {
            "degree": "Maritime Certificate",
            "institution": "Academy",
            "location": "Indonesia",
            "graduationDate": "2015"
        }
    ],
    "certificates": [
        {
            "name": "STCW",
            "issuer": "IMO",
            "date": "2015",
            "validity": "Lifetime"
        }
    ],
    "skills": [
        {
            "name": "Navigation",
            "level": 5
        }
    ],
    "languages": [
        {
            "name": "English",
            "level": "Fluent"
        }
    ]
}

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.jwt_token = None
        self.test_results = []
        
    def log_test(self, test_name, success, message, details=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
        
        if details:
            print(f"   Details: {details}")
        print()
    
    def test_payment_info_api(self):
        """Test GET /api/settings/payment-info (public API)"""
        try:
            response = self.session.get(f"{BASE_URL}/settings/payment-info")
            
            if response.status_code == 200:
                data = response.json()
                payment_info = data.get("paymentInfo", {})
                
                # Check expected values
                expected_bank = "BNI"
                expected_account_name = "CV Jesse Energi Sejahtera"
                expected_account_number = "3334433003"
                
                bank_name = payment_info.get("bankName")
                account_name = payment_info.get("accountName")
                account_number = payment_info.get("accountNumber")
                
                if (bank_name == expected_bank and 
                    account_name == expected_account_name and 
                    account_number == expected_account_number):
                    self.log_test(
                        "Payment Info API",
                        True,
                        "Payment info returned correctly",
                        f"Bank: {bank_name}, Account: {account_name}, Number: {account_number}"
                    )
                else:
                    self.log_test(
                        "Payment Info API",
                        False,
                        "Payment info values don't match expected",
                        f"Expected: BNI, CV Jesse Energi Sejahtera, 3334433003. Got: {bank_name}, {account_name}, {account_number}"
                    )
            else:
                self.log_test(
                    "Payment Info API",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Payment Info API",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_admin_login(self):
        """Test POST /api/auth/login with admin credentials"""
        try:
            login_data = {
                "email": ADMIN_EMAIL,
                "password": ADMIN_PASSWORD
            }
            
            response = self.session.post(
                f"{BASE_URL}/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                token = data.get("token")
                user = data.get("user", {})
                
                if token and user.get("role") == "admin":
                    self.jwt_token = token
                    self.log_test(
                        "Admin Login",
                        True,
                        "Admin login successful, JWT token received",
                        f"User: {user.get('fullName')} ({user.get('email')}), Role: {user.get('role')}"
                    )
                else:
                    self.log_test(
                        "Admin Login",
                        False,
                        "Login response missing token or admin role",
                        f"Token present: {bool(token)}, Role: {user.get('role')}"
                    )
            else:
                self.log_test(
                    "Admin Login",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Admin Login",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_payment_status_check(self):
        """Test GET /api/payments/check-status with Authorization header"""
        if not self.jwt_token:
            self.log_test(
                "Payment Status Check",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            response = self.session.get(f"{BASE_URL}/payments/check-status", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                can_download = data.get("canDownload")
                
                if can_download is True:
                    self.log_test(
                        "Payment Status Check",
                        True,
                        "Payment status shows canDownload: true",
                        f"Response: {json.dumps(data, indent=2)}"
                    )
                else:
                    self.log_test(
                        "Payment Status Check",
                        False,
                        f"canDownload is {can_download}, expected True",
                        f"Response: {json.dumps(data, indent=2)}"
                    )
            else:
                self.log_test(
                    "Payment Status Check",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Payment Status Check",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_cv_download(self):
        """Test POST /api/cv/download with Authorization header and CV data"""
        if not self.jwt_token:
            self.log_test(
                "CV Download",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        try:
            headers = {
                "Authorization": f"Bearer {self.jwt_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.post(
                f"{BASE_URL}/cv/download",
                json=SAMPLE_CV_DATA,
                headers=headers
            )
            
            if response.status_code == 200:
                # Check if response is a PDF
                content_type = response.headers.get("content-type", "")
                content_disposition = response.headers.get("content-disposition", "")
                
                if "application/pdf" in content_type:
                    pdf_size = len(response.content)
                    self.log_test(
                        "CV Download",
                        True,
                        "PDF file generated successfully",
                        f"Content-Type: {content_type}, Size: {pdf_size} bytes, Disposition: {content_disposition}"
                    )
                else:
                    self.log_test(
                        "CV Download",
                        False,
                        "Response is not a PDF file",
                        f"Content-Type: {content_type}, Response: {response.text[:200]}..."
                    )
            else:
                self.log_test(
                    "CV Download",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "CV Download",
                False,
                f"Request failed: {str(e)}"
            )
    
    def test_get_all_payments(self):
        """Test GET /api/payments with Authorization header (admin)"""
        if not self.jwt_token:
            self.log_test(
                "Get All Payments",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            response = self.session.get(f"{BASE_URL}/payments", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                payments = data.get("payments", [])
                
                self.log_test(
                    "Get All Payments",
                    True,
                    f"Retrieved {len(payments)} payments",
                    f"Sample payment structure: {json.dumps(payments[0] if payments else {}, indent=2)}"
                )
            else:
                self.log_test(
                    "Get All Payments",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Get All Payments",
                False,
                f"Request failed: {str(e)}"
            )
    
    def run_all_tests(self):
        """Run all backend tests"""
        print("=" * 80)
        print("BACKEND API TESTING - CV Build for SEAMAN")
        print("=" * 80)
        print(f"Base URL: {BASE_URL}")
        print(f"Admin Email: {ADMIN_EMAIL}")
        print(f"Test Started: {datetime.now().isoformat()}")
        print("=" * 80)
        print()
        
        # Run tests in sequence
        self.test_payment_info_api()
        self.test_admin_login()
        self.test_payment_status_check()
        self.test_cv_download()
        self.test_get_all_payments()
        
        # Summary
        print("=" * 80)
        print("TEST SUMMARY")
        print("=" * 80)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests}")
        print(f"Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        print()
        
        if failed_tests > 0:
            print("FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['message']}")
            print()
        
        print("=" * 80)
        return failed_tests == 0

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    sys.exit(0 if success else 1)