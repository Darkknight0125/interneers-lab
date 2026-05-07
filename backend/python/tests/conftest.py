import pytest
import mongoengine
from scripts.seed_test_data import seed
from product.infrastructure.db.mongo import connect_to_mongo


TEST_DB_NAME = "product_db_test"


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """
    Runs once before all tests.
    Connects to test database.
    """

    mongoengine.disconnect()

    connect_to_mongo(
        db=TEST_DB_NAME,
        host="mongodb://localhost:27017"
    )

    yield

    # Cleanup after all tests
    mongoengine.connection.get_db().client.drop_database(TEST_DB_NAME)
    mongoengine.disconnect()


@pytest.fixture
def seed_data():
    """
    Seeds database before each test that needs it
    """
    seed()