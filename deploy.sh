#!/bin/bash

# VenueIQ GCP Deployment Script
# This script automates the process of deploying the VenueIQ demo to Google Cloud Run.

# --- Configuration ---
PROJECT_ID=$(gcloud config get-value project)
SERVICE_NAME="venue-iq-pro"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"
REPOSITORY="venue-iq-repo"

echo "🚀 Starting Deployment for Project: $PROJECT_ID"

# 1. Enable Required APIs
echo "📦 Enabling Google Cloud APIs..."
gcloud services enable run.googleapis.com \
                       artifactregistry.googleapis.com \
                       cloudbuild.googleapis.com

# 2. Create Artifact Registry (if not exists)
echo "🏗️ Ensuring Artifact Registry exists..."
gcloud artifacts repositories create $REPOSITORY \
    --repository-format=docker \
    --location=$REGION \
    --description="VenueIQ Docker Repository" 2>/dev/null || echo "Registry already exists."

# 3. Build and Push using Cloud Build (Efficient)
echo "🛠️ Building container image with Cloud Build..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME .

# 4. Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --set-env-vars="VITE_GEMINI_API_KEY=YOUR_KEY_HERE,VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY_HERE"

echo "✅ Deployment Complete!"
gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)'
