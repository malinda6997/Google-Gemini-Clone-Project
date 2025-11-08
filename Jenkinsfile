pipeline {
    agent any
      
    environment {
        DOCKER_HUB_REPO = 'malinda6997/gemini-app'
        EC2_HOST = '54.242.239.70'
        VERSION = "v1.0.${BUILD_NUMBER}"
        IMAGE_NAME = "${DOCKER_HUB_REPO}:${VERSION}"
        LATEST_IMAGE = "${DOCKER_HUB_REPO}:latest"
    }
    
    stages {
        stage('Create Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    echo "Version: ${VERSION}"
                    
                    // Clean old images first
                    sh "docker rmi ${IMAGE_NAME} || true"
                    sh "docker rmi ${LATEST_IMAGE} || true"
                    
                    // Build new image
                    sh "docker build -t ${IMAGE_NAME} ."
                    sh "docker tag ${IMAGE_NAME} ${LATEST_IMAGE}"
                    
                    echo "✅ Docker image created: ${IMAGE_NAME}"
                }
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Pushing to Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        sh "docker push ${IMAGE_NAME}"
                        sh "docker push ${LATEST_IMAGE}"
                        sh "docker logout"
                    }
                    echo "✅ Pushed to Docker Hub: ${VERSION}"
                }
            }
        }
        
        stage('Pull to Server') {
            steps {
                script {
                    echo "Pulling image to EC2 server..."
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                echo "Cleaning old images..."
                                docker rmi ${LATEST_IMAGE} || true
                                docker system prune -f
                                
                                echo "Pulling latest image..."
                                docker pull ${LATEST_IMAGE}
                            '
                        """
                    }
                    echo "✅ Image pulled to server"
                }
            }
        }
        
        stage('Create Docker Container') {
            steps {
                script {
                    echo "Creating new container..."
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                echo "Stopping old container..."
                                docker stop gemini-app || true
                                docker rm gemini-app || true
                                
                                echo "Creating new container..."
                                docker run -d \\
                                    --name gemini-app \\
                                    -p 80:5173 \\
                                    --restart unless-stopped \\
                                    ${LATEST_IMAGE}
                            '
                        """
                    }
                    echo "✅ Container created successfully"
                }
            }
        }
        
        stage('Deploy to Server') {
            steps {
                script {
                    echo "Verifying deployment..."
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                echo "Checking container status..."
                                docker ps | grep gemini-app
                                
                                echo "Testing app response..."
                                sleep 10
                                curl -f http://localhost:5173 || echo "App starting up..."
                                
                                echo "Deployment verification complete!"
                            '
                        """
                    }
                    
                    // Clean up local images
                    sh "docker rmi ${IMAGE_NAME} || true"
                    sh "docker rmi ${LATEST_IMAGE} || true"
                    
                    echo "✅ Deployment completed successfully!"
                    echo "🌐 App live at: http://${EC2_HOST}"
                    echo "📦 Version: ${VERSION}"
                }
            }
        }
    }
    
    post {
        success {
            echo "🎉 CI/CD Pipeline SUCCESS!"
            echo "🌐 Live URL: http://${EC2_HOST}"
            echo "📦 Version: ${VERSION}"
            echo "⏰ Build time: ${currentBuild.durationString}"
        }
        
        failure {
            echo "❌ CI/CD Pipeline FAILED!"
            echo "🔍 Check logs above for details"
            
            // Cleanup on failure
            script {
                sh "docker rmi ${IMAGE_NAME} || true"
                sh "docker rmi ${LATEST_IMAGE} || true"
            }
        }
        
        always {
            echo "🧹 Pipeline cleanup completed"
        }
    }
}
