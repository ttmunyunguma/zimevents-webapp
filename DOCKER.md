# Docker Deployment Guide

This guide explains how to containerize and deploy the ZimEvents Web application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- GitHub account with access to the repository (for pulling images)

## Files Created

- **Dockerfile**: Multi-stage build configuration for production deployment
- **.dockerignore**: Excludes unnecessary files from the Docker build context
- **docker-compose.yml**: Orchestration file for easy deployment
- **next.config.mjs**: Updated with `output: 'standalone'` for optimized Docker builds

## Quick Start

### Option 1: Using Docker Compose with Pre-built Images (Recommended)

This method pulls the pre-built image from GitHub Container Registry, which is automatically built and pushed when code is merged to master.

1. **Authenticate with GitHub Container Registry**:
   ```bash
   echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
   ```
   
   Or create a Personal Access Token (PAT) with `read:packages` scope at https://github.com/settings/tokens

2. **Set environment variables** (create a `.env.docker` file):
   ```env
   GITHUB_REPOSITORY=luz/zimevents-web
   IMAGE_TAG=latest
   ```

3. **Pull and run**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. **Access the application**:
   - Open http://localhost:3000 in your browser

5. **View logs**:
   ```bash
   docker-compose logs -f web
   ```

6. **Update to latest version**:
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

7. **Stop the application**:
   ```bash
   docker-compose down
   ```

### Option 2: Building Locally (Development)

If you need to build the image locally instead of pulling from the registry:

1. **Modify docker-compose.yml** to use build instead of image:
   ```yaml
   services:
     web:
       build:
         context: .
         dockerfile: Dockerfile
         args:
           NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-http://localhost:8080/api/v1}
           NEXT_PUBLIC_API_KEY: ${NEXT_PUBLIC_API_KEY:-dev-key-1234}
   ```

2. **Build and run**:
   ```bash
   docker-compose up -d --build
   ```

### Option 3: Using Docker CLI with Registry Image

1. **Pull the image**:
   ```bash
   docker pull ghcr.io/luz/zimevents-web:latest
   ```

2. **Run the container**:
   ```bash
   docker run -d \
     -p 3000:3000 \
     --name zimevents-web \
     ghcr.io/luz/zimevents-web:latest
   ```

3. **View logs**:
   ```bash
   docker logs -f zimevents-web
   ```

4. **Stop the container**:
   ```bash
   docker stop zimevents-web
   docker rm zimevents-web
   ```

## GitHub Actions CI/CD

The repository includes a GitHub Actions workflow that automatically:

1. **Runs linting** on every push to master
2. **Builds the Docker image** using the multi-stage Dockerfile
3. **Pushes to GitHub Container Registry** with tags:
   - `latest` (for the master branch)
   - `master-<commit-sha>` (for specific commits)
   - Custom tags (via manual workflow dispatch)

### Workflow File

The workflow is defined in [`.github/workflows/build-and-push.yml`](.github/workflows/build-and-push.yml:1).

### Setting Up Secrets

For the workflow to build images with proper API configuration, set these secrets in your GitHub repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
   - `NEXT_PUBLIC_API_KEY`: Your API authentication key

If these secrets are not set, the workflow will use default development values.

### Manual Workflow Dispatch

You can manually trigger the workflow with a custom tag:

1. Go to **Actions** tab in GitHub
2. Select **Build and Push Docker Image**
3. Click **Run workflow**
4. Enter an optional custom tag (e.g., `v1.0.0`, `staging`)

### Viewing Build Results

After each push to master:
- Check the **Actions** tab for build status
- View the **Summary** for deployment instructions
- Find the image at `ghcr.io/luz/zimevents-web:latest`

## Docker Image Details

### Multi-Stage Build

The Dockerfile uses a 3-stage build process:

1. **deps**: Installs dependencies using pnpm
2. **builder**: Builds the Next.js application
3. **runner**: Creates the minimal production image

### Image Size Optimization

- Uses Alpine Linux (minimal base image)
- Multi-stage build removes build dependencies
- Only includes necessary runtime files
- Standalone output mode reduces image size

### Security Features

- Runs as non-root user (`nextjs:nodejs`)
- Minimal attack surface with Alpine Linux
- No unnecessary packages installed
- Environment variables for sensitive data

## Environment Variables

### Build-time Variables (--build-arg)

- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_API_KEY`: API authentication key

These are baked into the build and cannot be changed at runtime.

### Runtime Variables

- `NODE_ENV`: Set to `production` (default)
- `PORT`: Application port (default: 3000)
- `HOSTNAME`: Bind address (default: 0.0.0.0)

## Accessing GitHub Container Registry

### Authentication

To pull images from GitHub Container Registry, you need to authenticate:

1. **Create a Personal Access Token (PAT)**:
   - Go to https://github.com/settings/tokens
   - Click **Generate new token (classic)**
   - Select scope: `read:packages`
   - Copy the token

2. **Login to registry**:
   ```bash
   echo YOUR_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
   ```

3. **For production servers**, store credentials:
   ```bash
   docker login ghcr.io
   # Enter username and token when prompted
   ```

### Making Images Public (Optional)

To allow unauthenticated pulls:

1. Go to the package page: https://github.com/luz/zimevents-web/pkgs/container/zimevents-web
2. Click **Package settings**
3. Scroll to **Danger Zone**
4. Click **Change visibility** → **Public**

## Production Deployment

### Cloud Platforms

#### AWS ECS/Fargate
```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/luz/zimevents-web:latest

# Tag for ECR
docker tag ghcr.io/luz/zimevents-web:latest your-account.dkr.ecr.region.amazonaws.com/zimevents-web:latest

# Push to ECR
docker push your-account.dkr.ecr.region.amazonaws.com/zimevents-web:latest
```

#### Google Cloud Run
```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/luz/zimevents-web:latest

# Tag for GCR
docker tag ghcr.io/luz/zimevents-web:latest gcr.io/your-project/zimevents-web:latest

# Push to GCR
docker push gcr.io/your-project/zimevents-web:latest
```

#### Azure Container Instances
```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/luz/zimevents-web:latest

# Tag for ACR
docker tag ghcr.io/luz/zimevents-web:latest yourregistry.azurecr.io/zimevents-web:latest

# Push to ACR
docker push yourregistry.azurecr.io/zimevents-web:latest
```

#### Direct Deployment from GHCR

Most cloud platforms can pull directly from GitHub Container Registry:

**AWS ECS Task Definition**:
```json
{
  "containerDefinitions": [{
    "image": "ghcr.io/luz/zimevents-web:latest",
    "repositoryCredentials": {
      "credentialsParameter": "arn:aws:secretsmanager:region:account:secret:github-token"
    }
  }]
}
```

**Google Cloud Run**:
```bash
gcloud run deploy zimevents-web \
  --image ghcr.io/luz/zimevents-web:latest \
  --platform managed
```

**Azure Container Instances**:
```bash
az container create \
  --resource-group myResourceGroup \
  --name zimevents-web \
  --image ghcr.io/luz/zimevents-web:latest \
  --registry-username YOUR_GITHUB_USERNAME \
  --registry-password YOUR_GITHUB_TOKEN
```

### Kubernetes Deployment

Example deployment manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: zimevents-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: zimevents-web
  template:
    metadata:
      labels:
        app: zimevents-web
    spec:
      containers:
      - name: web
        image: ghcr.io/luz/zimevents-web:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: zimevents-web
spec:
  selector:
    app: zimevents-web
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
---
apiVersion: v1
kind: Secret
metadata:
  name: ghcr-secret
type: kubernetes.io/dockerconfigjson
data:
  .dockerconfigjson: <base64-encoded-docker-config>
```

To create the image pull secret:
```bash
kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=YOUR_GITHUB_USERNAME \
  --docker-password=YOUR_GITHUB_TOKEN
```

Then reference it in your deployment:
```yaml
spec:
  template:
    spec:
      imagePullSecrets:
      - name: ghcr-secret
```

## Health Checks

The docker-compose.yml includes a health check that:
- Runs every 30 seconds
- Times out after 10 seconds
- Retries 3 times before marking unhealthy
- Waits 40 seconds before starting checks

## Troubleshooting

### Cannot pull image from GitHub Container Registry

**Error**: `unauthorized: authentication required`

**Solution**:
1. Ensure you're logged in: `docker login ghcr.io`
2. Verify your token has `read:packages` scope
3. Check if the package is public or you have access

### Build fails in GitHub Actions

**Error**: Build or push fails in workflow

**Solution**:
1. Check that `GITHUB_TOKEN` has package write permissions
2. Verify the workflow has `packages: write` permission
3. Check build logs in Actions tab

### Image not updating after pull

**Error**: `docker-compose pull` doesn't get latest changes

**Solution**:
```bash
docker-compose pull
docker-compose down
docker-compose up -d
```

Or force recreate:
```bash
docker-compose up -d --force-recreate
```

### Build fails with "pnpm not found"
The Dockerfile uses corepack to enable pnpm. Ensure you're using Node.js 20 or higher.

### Application doesn't start
Check logs: `docker logs zimevents-web`
Common issues:
- Missing environment variables
- Port 3000 already in use
- Insufficient memory

### Image size too large
The optimized image should be around 150-200MB. If larger:
- Ensure `.dockerignore` is present
- Check that `output: 'standalone'` is in next.config.mjs
- Verify multi-stage build is working

### Cannot connect to backend API
- Verify `NEXT_PUBLIC_API_URL` was set during build
- Check network connectivity between containers
- Ensure API key is valid

## Best Practices

1. **Use specific versions**: Pin Node.js and package versions
2. **Scan for vulnerabilities**: Run `docker scan ghcr.io/luz/zimevents-web:latest`
3. **Use secrets management**: Store API keys in GitHub Secrets, not in code
4. **Enable logging**: Configure proper log aggregation
5. **Monitor resources**: Set appropriate CPU/memory limits
6. **Use health checks**: Implement proper liveness/readiness probes
7. **Tag images properly**: Use semantic versioning (e.g., v1.0.0)
8. **Automate deployments**: Use GitHub Actions for CI/CD
9. **Pull specific tags**: Use commit SHA tags for reproducible deployments
10. **Keep images updated**: Regularly pull latest images with security patches

## Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Standalone Output](https://nextjs.org/docs/advanced-features/output-file-tracing)
- [GitHub Container Registry Documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [GitHub Actions Docker Build](https://docs.github.com/en/actions/publishing-packages/publishing-docker-images)