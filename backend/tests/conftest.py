# pytest configuration

import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__) + "/.."))

# Test configuration
def pytest_configure(config):
    """Configure pytest"""
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m \"not slow\"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
