#!/bin/bash
# Configuration
S3_BUCKET="jobapp-resumes-2026"
UPLOADS_DIR="/home/ubuntu/jobapp/uploads"
MYSQL_USER="jobappuser"
MYSQL_PASSWORD="securepassword"
MYSQL_DATABASE="jobappdb"
S3_PREFIX="resumes/"

# Log file
LOG_FILE="/home/ubuntu/jobapp/s3-upload.log"
echo "[$(date)] Starting S3 upload script" >> "$LOG_FILE"

# Ensure uploads directory exists
if [ ! -d "$UPLOADS_DIR" ]; then
  echo "[$(date)] Error: Uploads directory $UPLOADS_DIR does not exist" >> "$LOG_FILE"
  exit 1
fi

# Loop through PDF files in uploads directory
for file in "$UPLOADS_DIR"/*.pdf; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    s3_path="s3://$S3_BUCKET/$S3_PREFIX$filename"

    # Check if file already exists in S3
    if aws s3 ls "$s3_path" > /dev/null 2>&1; then
      echo "[$(date)] Skipping $filename: already exists in S3" >> "$LOG_FILE"
    else
      # Upload to S3 without ACL (defaults to public-read)
      aws s3 cp "$file" "$s3_path"
      if [ $? -eq 0 ]; then
        echo "[$(date)] Uploaded $filename to $s3_path" >> "$LOG_FILE"

        # Update MySQL with S3 URL
        s3_url="https://$S3_BUCKET.s3.amazonaws.com/$S3_PREFIX$filename"
        mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" -e \
          "UPDATE $MYSQL_DATABASE.applications SET resume_path='$s3_url' WHERE resume_path='uploads/$filename';" 2>> "$LOG_FILE"
        if [ $? -eq 0 ]; then
          echo "[$(date)] Updated MySQL for $filename with $s3_url" >> "$LOG_FILE"
          # Delete local file
          rm "$file"
          echo "[$(date)] Deleted local file $file" >> "$LOG_FILE"
        else
          echo "[$(date)] Error updating MySQL for $filename" >> "$LOG_FILE"
        fi
      else
        echo "[$(date)] Error uploading $filename to S3" >> "$LOG_FILE"
      fi
    fi
  fi
done

echo "[$(date)] S3 upload script completed" >> "$LOG_FILE"

