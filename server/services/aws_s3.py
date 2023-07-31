import boto3
import botocore
import logging
from botocore.exceptions import ClientError
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY')
AWS_ACCESS_SECRET = os.getenv('AWS_ACCESS_SECRET')
BUCKET_NAME = os.environ.get("BUCKET_NAME")
S3_LOCATION = f"https://{BUCKET_NAME}.s3.amazonaws.com/"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "gif"}

s3 = boto3.client(
   "s3",
   aws_access_key_id=os.environ.get("AWS_ACCESS_KEY"),
   aws_secret_access_key=os.environ.get("AWS_ACCESS_SECRET")
)

def allowed_file(filename):
    return "." in filename and \
           filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def get_unique_filename(filename):
    ext = filename.rsplit(".", 1)[1].lower()
    unique_filename = uuid.uuid4().hex
    return f"{unique_filename}.{ext}"

def create_bucket(bucket_name, region=None):
    """Create an S3 bucket in a specified region

    If a region is not specified, the bucket is created in the S3 default
    region (us-east-1).

    :param bucket_name: Bucket to create
    :param region: String region to create bucket in, e.g., 'us-west-2'
    :return: True if bucket created, else False
    """

    # Create bucket
    try:
        if region is None:
            s3_client = boto3.client('s3')
            s3_client.create_bucket(Bucket=bucket_name)
        else:
            s3_client = boto3.client('s3', region_name=region)
            location = {'LocationConstraint': region}
            s3_client.create_bucket(Bucket=bucket_name,
                                    CreateBucketConfiguration=location)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def upload_file_to_s3(file, bucket = BUCKET_NAME):
    """Upload a file-like object to this bucket.
    The file-like object must be in binary mode.

    :param file: binary file to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    try:
        s3.upload_fileobj(
            file,
            bucket,
            f'uploads/{file.filename}',
            ExtraArgs={
                "ContentType": file.content_type
            }
        )
    except Exception as e:
        # in case the our s3 upload fails
        return {"errors": str(e)}

    return {"url": f"{S3_LOCATION}{file.filename}"}

def get_image_url(bucket, filename):
    presigned_url = ''
    try:
        for item in s3.list_objects(Bucket=bucket)['Contents']:
            if item['Key'] == f'uploads/{filename}': # unique filename
                presigned_url = s3.generate_presigned_url('get_object', Params = {'Bucket': bucket, 'Key': item['Key']}, ExpiresIn = 100)
                break
    except Exception as e:
        pass
    return presigned_url

from pathlib import Path
def upload_file_using_client():
    """
    Uploads file to S3 bucket using S3 client object
    :return: None
    """
    s3 = boto3.client("s3")
    object_name = "IMG_B2B602DCF126-1.jpeg"
    file_name = os.path.join("/Users/tungngo/Downloads", "IMG_B2B602DCF126-1.jpeg")
    print(file_name)
    response = s3.upload_file(file_name, BUCKET_NAME, object_name)
    print(response)  # prints None