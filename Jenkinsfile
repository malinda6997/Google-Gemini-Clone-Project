pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'malinda6997/gemini-clone'
        EC2_HOST = '3.83.237.199'
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }
    
    stages {
        stage('Build & Deploy') {
            steps {
                script {
                    // Build Docker image
                    echo "Building Docker image..."
                    sh "docker build -t ${DOCKER_HUB_REPO}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_REPO}:${IMAGE_TAG} ${DOCKER_HUB_REPO}:latest"
                    
                    // Login and push to Docker Hub
                    echo "Pushing to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                        sh "docker push ${DOCKER_HUB_REPO}:latest"
                    }
                    
                    // Deploy to EC2
                    echo "Deploying to EC2..."
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                # Stop old container
                                docker stop gemini-container || true
                                docker rm gemini-container || true
                                
                                # Clean old images
                                docker rmi ${DOCKER_HUB_REPO}:latest || true
                                
                                # Pull and run new container
                                docker pull ${DOCKER_HUB_REPO}:latest
                                docker run -d --name gemini-container -p 80:5173 --restart unless-stopped ${DOCKER_HUB_REPO}:latest
                                
                                # Verify
                                docker ps | grep gemini-container
                            '
                        """
                    }
                    
                    // Cleanup
                    sh "docker logout"
                    sh "docker rmi ${DOCKER_HUB_REPO}:${IMAGE_TAG} || true"
                    sh "docker rmi ${DOCKER_HUB_REPO}:latest || true"
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment successful!"
            echo "🌐 App live at: http://${EC2_HOST}"
            echo "🏷️ Version: ${IMAGE_TAG}"
        }
        
        failure {
            echo "❌ Deployment failed!"
        }
    }
}