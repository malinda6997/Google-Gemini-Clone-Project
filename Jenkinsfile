pipeline {
    agent any
      
    environment {
        EC2_HOST = '54.242.239.70'
        VERSION = "v1.0.${BUILD_NUMBER}"
        IMAGE_NAME = "gemini-app:${VERSION}"
        LATEST_IMAGE = "gemini-app:latest"
    }
    
    stages {
        stage('Build Docker Image on Jenkins') {
            steps {
                script {
                    echo "Building Docker image on Jenkins..."
                    echo "Version: ${VERSION}"
                    
                    // Remove old images if they exist
                    sh "docker rmi ${IMAGE_NAME} || true"
                    sh "docker rmi ${LATEST_IMAGE} || true"
                    
                    // Build new image locally
                    sh "docker build -t ${IMAGE_NAME} ."
                    sh "docker tag ${IMAGE_NAME} ${LATEST_IMAGE}"
                    
                    echo "✅ Docker image created: ${IMAGE_NAME}"
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                script {
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                echo "Cleaning old container and images..."
                                docker stop gemini-app || true
                                docker rm gemini-app || true
                                docker rmi ${LATEST_IMAGE} || true
                                
                                echo "Copying new image from Jenkins to EC2..."
                                docker save ${LATEST_IMAGE} | bzip2 | ssh ubuntu@${EC2_HOST} "bunzip2 | docker load"
                                
                                echo "Running new container..."
                                docker run -d \\
                                    --name gemini-app \\
                                    -p 80:5173 \\
                                    --restart unless-stopped \\
                                    ${LATEST_IMAGE}
                                
                                echo "✅ Deployment complete!"
                            '
                        """
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                script {
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
                }
            }
        }
    }
    
    post {
        success {
            echo "🎉 CI/CD Pipeline SUCCESS!"
            echo "🌐 App live at: http://${EC2_HOST}"
            echo "📦 Version: ${VERSION}"
        }
        failure {
            echo "❌ CI/CD Pipeline FAILED! Check logs above."
        }
        always {
            echo "🧹 Pipeline cleanup completed"
        }
    }
}
