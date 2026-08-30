#!/bin/bash

# Tally Web Deployment Script
# Usage: ./scripts/deploy.sh [environment] [action]
# Example: ./scripts/deploy.sh production build-and-push

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-staging}"
ACTION="${2:-build}"
REGISTRY="${REGISTRY:-docker.io}"
NAMESPACE="${NAMESPACE:-tally}"
SERVICE_NAME="tally-web"
BUILD_CONTEXT="."
DOCKER_FILE="Dockerfile"

# Get version from package.json
VERSION=$(grep '"version"' package.json | head -1 | awk -F'"' '{print $4}')
GIT_COMMIT=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
IMAGE_TAG="${ENVIRONMENT}-${VERSION}-${GIT_COMMIT}-${TIMESTAMP}"
IMAGE_NAME="${REGISTRY}/${NAMESPACE}/${SERVICE_NAME}"
FULL_IMAGE="${IMAGE_NAME}:${IMAGE_TAG}"
LATEST_IMAGE="${IMAGE_NAME}:${ENVIRONMENT}-latest"

echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${BLUE}Tally Web Deployment Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"
echo -e "${YELLOW}Environment:${NC} ${ENVIRONMENT}"
echo -e "${YELLOW}Action:${NC} ${ACTION}"
echo -e "${YELLOW}Version:${NC} ${VERSION}"
echo -e "${YELLOW}Git Commit:${NC} ${GIT_COMMIT}"
echo -e "${YELLOW}Image Name:${NC} ${FULL_IMAGE}"
echo -e "${BLUE}═══════════════════════════════════════════${NC}"

# Function to print section
print_section() {
    echo -e "\n${BLUE}→ $1${NC}"
}

# Function to check prerequisites
check_prerequisites() {
    print_section "Checking prerequisites..."

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}✗ Docker is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker is installed${NC}"

    if ! command -v docker-compose &> /dev/null; then
        echo -e "${RED}✗ Docker Compose is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker Compose is installed${NC}"
}

# Function to build Docker image
build_image() {
    print_section "Building Docker image..."

    docker build \
        --tag "${FULL_IMAGE}" \
        --tag "${LATEST_IMAGE}" \
        --build-arg NODE_ENV=${ENVIRONMENT} \
        --file ${DOCKER_FILE} \
        ${BUILD_CONTEXT}

    echo -e "${GREEN}✓ Docker image built successfully${NC}"
    echo -e "${YELLOW}  Image:${NC} ${FULL_IMAGE}"
}

# Function to push image to registry
push_image() {
    print_section "Pushing Docker image to registry..."

    if [ "${REGISTRY}" = "docker.io" ]; then
        if ! docker info | grep -q "Username"; then
            echo -e "${YELLOW}Please login to Docker registry${NC}"
            docker login ${REGISTRY}
        fi
    fi

    docker push "${FULL_IMAGE}"
    docker push "${LATEST_IMAGE}"

    echo -e "${GREEN}✓ Docker image pushed successfully${NC}"
    echo -e "${YELLOW}  Full Image:${NC} ${FULL_IMAGE}"
    echo -e "${YELLOW}  Latest Image:${NC} ${LATEST_IMAGE}"
}

# Function to test build
test_image() {
    print_section "Testing Docker image..."

    # Run container and check health
    CONTAINER_ID=$(docker run -d -p 3000:3000 \
        -e NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1 \
        -e NEXT_PUBLIC_APP_URL=http://localhost:3000 \
        "${FULL_IMAGE}")

    sleep 5

    if curl -f http://localhost:3000 &> /dev/null; then
        echo -e "${GREEN}✓ Container started successfully${NC}"
    else
        echo -e "${RED}✗ Container failed health check${NC}"
        docker logs ${CONTAINER_ID}
        docker rm -f ${CONTAINER_ID}
        exit 1
    fi

    docker rm -f ${CONTAINER_ID}
}

# Function to deploy with Docker Compose
deploy_compose() {
    print_section "Deploying with Docker Compose..."

    if [ ! -f "docker-compose.deploy.yml" ]; then
        echo -e "${RED}✗ docker-compose.deploy.yml not found${NC}"
        exit 1
    fi

    export IMAGE_TAG="${ENVIRONMENT}-latest"
    export SERVICE_NAME

    docker-compose -f docker-compose.deploy.yml up -d

    sleep 5

    if docker-compose -f docker-compose.deploy.yml ps | grep -q "Up"; then
        echo -e "${GREEN}✓ Service deployed successfully${NC}"
    else
        echo -e "${RED}✗ Service deployment failed${NC}"
        docker-compose -f docker-compose.deploy.yml logs
        exit 1
    fi
}

# Function to deploy to Kubernetes
deploy_kubernetes() {
    print_section "Deploying to Kubernetes..."

    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}✗ kubectl is not installed${NC}"
        exit 1
    fi

    # Update image in deployment manifest
    kubectl set image deployment/${SERVICE_NAME} \
        ${SERVICE_NAME}=${FULL_IMAGE} \
        --namespace=${ENVIRONMENT}

    kubectl rollout status deployment/${SERVICE_NAME} \
        --namespace=${ENVIRONMENT}

    echo -e "${GREEN}✓ Kubernetes deployment successful${NC}"
}

# Function to run tests
run_tests() {
    print_section "Running tests..."

    pnpm install
    pnpm typecheck
    pnpm lint
    pnpm test

    echo -e "${GREEN}✓ All tests passed${NC}"
}

# Function to build production bundle
build_production() {
    print_section "Building production bundle..."

    pnpm install
    pnpm build

    echo -e "${GREEN}✓ Production build completed${NC}"

    # Show build stats
    if [ -d ".next" ]; then
        echo -e "${YELLOW}Build size:${NC}"
        du -sh .next
    fi
}

# Function to check environment
check_environment() {
    print_section "Checking deployment environment..."

    if [ ! -f ".env.${ENVIRONMENT}" ] && [ ! -f ".env.production" ]; then
        echo -e "${YELLOW}⚠ No .env file found for ${ENVIRONMENT}${NC}"
        echo -e "${YELLOW}  Update .env.production with your production variables${NC}"
    else
        echo -e "${GREEN}✓ Environment file found${NC}"
    fi
}

# Function to show status
show_status() {
    print_section "Deployment Status"

    echo -e "${YELLOW}Docker Images:${NC}"
    docker images | grep ${SERVICE_NAME} || echo "No images found"

    echo -e "\n${YELLOW}Docker Containers:${NC}"
    docker ps -a | grep ${SERVICE_NAME} || echo "No containers found"

    echo -e "\n${YELLOW}Docker Compose Services:${NC}"
    docker-compose -f docker-compose.deploy.yml ps || echo "No services running"
}

# Main execution
case ${ACTION} in
    check)
        check_prerequisites
        check_environment
        ;;
    build)
        check_prerequisites
        build_production
        build_image
        ;;
    test)
        check_prerequisites
        build_production
        build_image
        test_image
        ;;
    push)
        check_prerequisites
        build_production
        build_image
        push_image
        ;;
    build-and-push)
        check_prerequisites
        build_production
        run_tests
        build_image
        test_image
        push_image
        ;;
    deploy-compose)
        check_prerequisites
        check_environment
        deploy_compose
        ;;
    deploy-k8s)
        check_prerequisites
        deploy_kubernetes
        ;;
    deploy)
        check_prerequisites
        build_production
        run_tests
        build_image
        test_image
        push_image
        deploy_compose
        ;;
    status)
        show_status
        ;;
    *)
        echo -e "${RED}Unknown action: ${ACTION}${NC}"
        echo -e "${YELLOW}Available actions:${NC}"
        echo "  check              - Check prerequisites and environment"
        echo "  build              - Build production bundle and Docker image"
        echo "  test               - Build and test Docker image"
        echo "  push               - Push image to registry"
        echo "  build-and-push     - Build, test, and push"
        echo "  deploy-compose     - Deploy using Docker Compose"
        echo "  deploy-k8s         - Deploy to Kubernetes"
        echo "  deploy             - Full deployment (build, test, push, deploy)"
        echo "  status             - Show deployment status"
        exit 1
        ;;
esac

echo -e "\n${GREEN}✓ Deployment script completed${NC}"
