from django.test import TestCase
from .models import Report

class ReportModelTest(TestCase):
    def test_report_creation(self):
        report = Report.objects.create(title="Test Report")
        self.assertTrue(report.title.startswith("Test"))

