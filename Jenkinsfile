pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'gemini-app'
        EC2_HOST = '3.83.237.199'
    }
    
    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                script {
                    echo "Deploying to EC2..."
                    sshagent(['ec2-ssh-key']) {
                        // Copy Docker image to EC2
                        sh "docker save ${IMAGE_NAME} | gzip > ${IMAGE_NAME}.tar.gz"
                        sh "scp -o StrictHostKeyChecking=no ${IMAGE_NAME}.tar.gz ubuntu@${EC2_HOST}:~/"
                        
                        // Deploy on EC2
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                # Stop old container
                                docker stop gemini-container || true
                                docker rm gemini-container || true
                                
                                # Load new image
                                gunzip -c ${IMAGE_NAME}.tar.gz | docker load
                                
                                # Run new container
                                docker run -d --name gemini-container -p 80:5173 --restart unless-stopped ${IMAGE_NAME}
                                
                                # Cleanup
                                rm ${IMAGE_NAME}.tar.gz
                                
                                # Verify
                                docker ps | grep gemini-container
                            '
                        """
                    }
                    
                    // Cleanup local files
                    sh "rm ${IMAGE_NAME}.tar.gz"
                    sh "docker rmi ${IMAGE_NAME} || true"
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment successful!"
            echo "App live at: http://${EC2_HOST}"
        }
        
        failure {
            echo "❌ Deployment failed!"
        }
    }
}