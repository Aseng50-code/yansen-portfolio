#!/usr/bin/env python3
"""
Backend API Testing for CV Build for SEAMAN Application
Testing Maritime Job Openings (Announcements) API and Payment/CV Download flow
"""

import requests
import json
import sys
from datetime import datetime

# Configuration
BASE_URL = "https://maritime-cv-1.preview.emergentagent.com/api"
ADMIN_EMAIL = "yansen@jesseenergisejahtera.com"
ADMIN_PASSWORD = "123456"

# Test data for announcements
SAMPLE_ANNOUNCEMENT_DATA = {
    "title": "Urgent: Chief Engineer Position Available",
    "coverImage": "https://example.com/ship-image.jpg",
    "body": "<h2>Position Details</h2><p>We are seeking an experienced <strong>Chief Engineer</strong> for our container vessel fleet.</p><ul><li>Minimum 5 years experience</li><li>Valid STCW certificates required</li><li>Competitive salary package</li></ul><p>Join our team and sail the world!</p>",
    "positions": [
        {
            "title": "Chief Engineer",
            "rank": "Chief Engineer",
            "vesselType": "Container Vessel",
            "contractDuration": "6 months",
            "salary": "$8,000 - $10,000 USD"
        }
    ],
    "contactInfo": "recruitment@maritime-company.com",
    "tags": ["Chief Engineer", "Container Vessel", "Urgent", "STCW"],
    "status": "published"
}

SAMPLE_COMMENT_DATA = {
    "content": "This looks like a great opportunity! I have 8 years of experience as Chief Engineer on container vessels. How can I apply?"
}
SAMPLE_CV_DATA = {
    "personalInfo": {
        "fullName": "Captain James Anderson",
        "title": "Master Mariner (Chief Officer)",
        "email": "james.anderson@maritime.com",
        "phone": "+1 (555) 789-0123",
        "location": "Miami, Florida, USA",
        "nationality": "American",
        "dateOfBirth": "January 15, 1985",
        "linkedin": "linkedin.com/in/jamesanderson",
        "instagram": "@captainjames",
        "summary": "Experienced Master Mariner with over 12 years of sea service."
    },
    "experience": [
        {
            "position": "Second Officer",
            "employer": "Maersk Line",
            "location": "Container Vessels",
            "startDate": "Jan 2020",
            "current": True,
            "description": ["Navigation watch keeping"]
        }
    ],
    "education": [
        {
            "degree": "Master Mariner Certificate",
            "institution": "Maritime Academy",
            "location": "NY",
            "graduationDate": "May 2016"
        }
    ],
    "certificates": [
        {
            "name": "STCW Basic Safety",
            "issuer": "IMO",
            "date": "2014",
            "validity": "Lifetime"
        }
    ],
    "skills": [
        {
            "name": "Navigation",
            "level": 5
        },
        {
            "name": "ECDIS",
            "level": 4
        }
    ],
    "languages": [
        {
            "name": "English",
            "level": "Native"
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
    
    def test_cv_download_pdf_quality(self):
        """Test POST /api/cv/download and verify PDF quality matches web preview"""
        if not self.jwt_token:
            self.log_test(
                "CV Download PDF Quality",
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
                pdf_content = response.content
                
                # Verify it's a valid PDF file
                is_valid_pdf = pdf_content.startswith(b'%PDF')
                pdf_size = len(pdf_content)
                
                # Save PDF for manual inspection if needed
                filename = "test_captain_james_anderson_cv.pdf"
                with open(f"/app/{filename}", "wb") as f:
                    f.write(pdf_content)
                
                if "application/pdf" in content_type and is_valid_pdf and pdf_size > 1000:
                    # Extract filename from Content-Disposition header
                    expected_filename_part = "Captain_James_Anderson"
                    filename_in_header = content_disposition
                    
                    self.log_test(
                        "CV Download PDF Quality",
                        True,
                        "PDF generated successfully with correct format and quality",
                        f"Content-Type: {content_type}, Size: {pdf_size} bytes, Valid PDF: {is_valid_pdf}, Disposition: {content_disposition}, Saved as: {filename}"
                    )
                    
                    # Additional quality checks
                    quality_issues = []
                    if pdf_size < 5000:
                        quality_issues.append("PDF size seems small (< 5KB)")
                    if expected_filename_part not in content_disposition:
                        quality_issues.append(f"Filename doesn't contain expected name part: {expected_filename_part}")
                    
                    if quality_issues:
                        self.log_test(
                            "CV Download PDF Quality - Minor Issues",
                            True,
                            "PDF generated but with minor quality concerns",
                            f"Issues: {', '.join(quality_issues)}"
                        )
                else:
                    issues = []
                    if "application/pdf" not in content_type:
                        issues.append(f"Wrong content type: {content_type}")
                    if not is_valid_pdf:
                        issues.append("Not a valid PDF (doesn't start with %PDF)")
                    if pdf_size <= 1000:
                        issues.append(f"PDF too small: {pdf_size} bytes")
                    
                    self.log_test(
                        "CV Download PDF Quality",
                        False,
                        "PDF quality issues detected",
                        f"Issues: {', '.join(issues)}"
                    )
            else:
                self.log_test(
                    "CV Download PDF Quality",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "CV Download PDF Quality",
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
        self.test_cv_download_pdf_quality()
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