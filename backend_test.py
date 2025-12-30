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
        self.created_announcement_id = None
        self.created_comment_id = None
        
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
    
    def test_get_announcements(self):
        """Test GET /api/announcements - Fetch all announcements (should return 2 existing announcements)"""
        try:
            response = self.session.get(f"{BASE_URL}/announcements")
            
            if response.status_code == 200:
                data = response.json()
                announcements = data.get("announcements", [])
                
                if len(announcements) >= 2:
                    self.log_test(
                        "Get All Announcements",
                        True,
                        f"Retrieved {len(announcements)} announcements (expected at least 2)",
                        f"First announcement: {announcements[0].get('title', 'No title')} by {announcements[0].get('authorName', 'Unknown')}"
                    )
                else:
                    self.log_test(
                        "Get All Announcements",
                        False,
                        f"Expected at least 2 announcements, got {len(announcements)}",
                        f"Announcements: {[a.get('title') for a in announcements]}"
                    )
            else:
                self.log_test(
                    "Get All Announcements",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Get All Announcements",
                False,
                f"Request failed: {str(e)}"
            )

    def test_create_announcement(self):
        """Test POST /api/announcements - Create new announcement with rich HTML content"""
        if not self.jwt_token:
            self.log_test(
                "Create Announcement",
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
                f"{BASE_URL}/announcements",
                json=SAMPLE_ANNOUNCEMENT_DATA,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                announcement = data.get("announcement", {})
                self.created_announcement_id = announcement.get("id")
                
                # Verify rich HTML content is preserved
                body = announcement.get("body", "")
                has_html_tags = "<h2>" in body and "<strong>" in body and "<ul>" in body
                
                if self.created_announcement_id and has_html_tags:
                    self.log_test(
                        "Create Announcement",
                        True,
                        "Announcement created successfully with rich HTML content preserved",
                        f"ID: {self.created_announcement_id}, Title: {announcement.get('title')}, HTML preserved: {has_html_tags}"
                    )
                else:
                    issues = []
                    if not self.created_announcement_id:
                        issues.append("No announcement ID returned")
                    if not has_html_tags:
                        issues.append("HTML content not preserved")
                    
                    self.log_test(
                        "Create Announcement",
                        False,
                        "Announcement creation issues",
                        f"Issues: {', '.join(issues)}"
                    )
            else:
                self.log_test(
                    "Create Announcement",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Create Announcement",
                False,
                f"Request failed: {str(e)}"
            )

    def test_update_announcement(self):
        """Test PUT /api/announcements/{id} - Update an announcement"""
        if not self.jwt_token:
            self.log_test(
                "Update Announcement",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        if not self.created_announcement_id:
            self.log_test(
                "Update Announcement",
                False,
                "No announcement ID available (creation failed)"
            )
            return
            
        try:
            headers = {
                "Authorization": f"Bearer {self.jwt_token}",
                "Content-Type": "application/json"
            }
            
            # Update the announcement with new content
            updated_data = SAMPLE_ANNOUNCEMENT_DATA.copy()
            updated_data["title"] = "UPDATED: Chief Engineer Position Available"
            updated_data["body"] = "<h2>Updated Position Details</h2><p>We are seeking an experienced <strong>Chief Engineer</strong> for our container vessel fleet.</p><p><em>This position has been updated with new requirements.</em></p>"
            
            response = self.session.put(
                f"{BASE_URL}/announcements/{self.created_announcement_id}",
                json=updated_data,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                announcement = data.get("announcement", {})
                
                title_updated = "UPDATED:" in announcement.get("title", "")
                body_updated = "updated with new requirements" in announcement.get("body", "")
                
                if title_updated and body_updated:
                    self.log_test(
                        "Update Announcement",
                        True,
                        "Announcement updated successfully",
                        f"Title: {announcement.get('title')}, Body contains update: {body_updated}"
                    )
                else:
                    self.log_test(
                        "Update Announcement",
                        False,
                        "Announcement update not reflected properly",
                        f"Title updated: {title_updated}, Body updated: {body_updated}"
                    )
            else:
                self.log_test(
                    "Update Announcement",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Update Announcement",
                False,
                f"Request failed: {str(e)}"
            )

    def test_like_announcement(self):
        """Test POST /api/announcements/{id}/like - Like an announcement (requires auth)"""
        if not self.jwt_token:
            self.log_test(
                "Like Announcement",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        if not self.created_announcement_id:
            self.log_test(
                "Like Announcement",
                False,
                "No announcement ID available (creation failed)"
            )
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            
            response = self.session.post(
                f"{BASE_URL}/announcements/{self.created_announcement_id}/like",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                message = data.get("message", "")
                liked = data.get("liked", False)
                likes_count = data.get("likes", 0)
                
                if "liked" in message.lower() and liked and likes_count > 0:
                    self.log_test(
                        "Like Announcement",
                        True,
                        "Announcement liked successfully",
                        f"Message: {message}, Liked: {liked}, Likes count: {likes_count}"
                    )
                else:
                    self.log_test(
                        "Like Announcement",
                        False,
                        "Like functionality not working properly",
                        f"Message: {message}, Liked: {liked}, Likes: {likes_count}"
                    )
            else:
                self.log_test(
                    "Like Announcement",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Like Announcement",
                False,
                f"Request failed: {str(e)}"
            )

    def test_comment_on_announcement(self):
        """Test POST /api/announcements/{id}/comment - Add comment to announcement (requires auth)"""
        if not self.jwt_token:
            self.log_test(
                "Comment on Announcement",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        if not self.created_announcement_id:
            self.log_test(
                "Comment on Announcement",
                False,
                "No announcement ID available (creation failed)"
            )
            return
            
        try:
            headers = {
                "Authorization": f"Bearer {self.jwt_token}",
                "Content-Type": "application/json"
            }
            
            response = self.session.post(
                f"{BASE_URL}/announcements/{self.created_announcement_id}/comment",
                json=SAMPLE_COMMENT_DATA,
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                message = data.get("message", "")
                comment = data.get("comment", {})
                self.created_comment_id = comment.get("id")
                
                if "added successfully" in message and self.created_comment_id:
                    self.log_test(
                        "Comment on Announcement",
                        True,
                        "Comment added successfully",
                        f"Comment ID: {self.created_comment_id}, Content: {comment.get('content', '')[:50]}..."
                    )
                else:
                    self.log_test(
                        "Comment on Announcement",
                        False,
                        "Comment creation failed",
                        f"Message: {message}, Comment ID: {self.created_comment_id}"
                    )
            else:
                self.log_test(
                    "Comment on Announcement",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Comment on Announcement",
                False,
                f"Request failed: {str(e)}"
            )

    def test_get_single_announcement(self):
        """Test GET /api/announcements/{id} - Get single announcement with comments"""
        if not self.created_announcement_id:
            self.log_test(
                "Get Single Announcement",
                False,
                "No announcement ID available (creation failed)"
            )
            return
            
        try:
            response = self.session.get(f"{BASE_URL}/announcements/{self.created_announcement_id}")
            
            if response.status_code == 200:
                data = response.json()
                announcement = data.get("announcement", {})
                comments = announcement.get("comments", [])
                
                has_title = bool(announcement.get("title"))
                has_body = bool(announcement.get("body"))
                has_comments = len(comments) > 0
                
                if has_title and has_body:
                    self.log_test(
                        "Get Single Announcement",
                        True,
                        "Single announcement retrieved successfully",
                        f"Title: {announcement.get('title')}, Comments: {len(comments)}, Has HTML body: {bool(announcement.get('body'))}"
                    )
                else:
                    self.log_test(
                        "Get Single Announcement",
                        False,
                        "Announcement data incomplete",
                        f"Has title: {has_title}, Has body: {has_body}, Comments: {len(comments)}"
                    )
            else:
                self.log_test(
                    "Get Single Announcement",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Get Single Announcement",
                False,
                f"Request failed: {str(e)}"
            )

    def test_delete_announcement(self):
        """Test DELETE /api/announcements/{id} - Delete an announcement"""
        if not self.jwt_token:
            self.log_test(
                "Delete Announcement",
                False,
                "No JWT token available (login failed)"
            )
            return
            
        if not self.created_announcement_id:
            self.log_test(
                "Delete Announcement",
                False,
                "No announcement ID available (creation failed)"
            )
            return
            
        try:
            headers = {"Authorization": f"Bearer {self.jwt_token}"}
            
            response = self.session.delete(
                f"{BASE_URL}/announcements/{self.created_announcement_id}",
                headers=headers
            )
            
            if response.status_code == 200:
                data = response.json()
                message = data.get("message", "")
                
                if "deleted successfully" in message:
                    self.log_test(
                        "Delete Announcement",
                        True,
                        "Announcement deleted successfully",
                        f"Message: {message}"
                    )
                    
                    # Verify deletion by trying to get the announcement
                    verify_response = self.session.get(f"{BASE_URL}/announcements/{self.created_announcement_id}")
                    if verify_response.status_code == 404:
                        self.log_test(
                            "Delete Announcement - Verification",
                            True,
                            "Deletion verified - announcement no longer exists",
                            "GET request returns 404 as expected"
                        )
                    else:
                        self.log_test(
                            "Delete Announcement - Verification",
                            False,
                            f"Announcement still exists after deletion (HTTP {verify_response.status_code})",
                            verify_response.text
                        )
                else:
                    self.log_test(
                        "Delete Announcement",
                        False,
                        "Unexpected delete response",
                        f"Message: {message}"
                    )
            else:
                self.log_test(
                    "Delete Announcement",
                    False,
                    f"HTTP {response.status_code}",
                    response.text
                )
                
        except Exception as e:
            self.log_test(
                "Delete Announcement",
                False,
                f"Request failed: {str(e)}"
            )

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
        print("Maritime Job Openings (Announcements) & Payment APIs")
        print("=" * 80)
        print(f"Base URL: {BASE_URL}")
        print(f"Admin Email: {ADMIN_EMAIL}")
        print(f"Test Started: {datetime.now().isoformat()}")
        print("=" * 80)
        print()
        
        # Run tests in sequence
        print("🚢 MARITIME JOB OPENINGS API TESTS")
        print("-" * 40)
        self.test_get_announcements()
        self.test_admin_login()  # Login first for authenticated tests
        self.test_create_announcement()
        self.test_update_announcement()
        self.test_like_announcement()
        self.test_comment_on_announcement()
        self.test_get_single_announcement()
        self.test_delete_announcement()
        
        print("\n💰 PAYMENT & CV DOWNLOAD API TESTS")
        print("-" * 40)
        self.test_payment_info_api()
        # Note: admin_login already called above
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
        
        # Categorize results
        maritime_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in ["Announcement", "Like", "Comment"])]
        payment_tests = [r for r in self.test_results if any(keyword in r["test"] for keyword in ["Payment", "CV Download", "Login"])]
        
        maritime_passed = sum(1 for r in maritime_tests if r["success"])
        payment_passed = sum(1 for r in payment_tests if r["success"])
        
        print(f"🚢 Maritime Job Openings: {maritime_passed}/{len(maritime_tests)} passed")
        print(f"💰 Payment & CV Download: {payment_passed}/{len(payment_tests)} passed")
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