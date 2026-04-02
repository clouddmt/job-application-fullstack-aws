#!/bin/bash

echo "Backup started at $(date)"
aws s3 sync s3://jobapp-resumes-2026 s3://jobapp-resumes-backup
echo "Backup completed at $(date)"
