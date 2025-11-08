pipeline {
    agent any
    
    environment {
        DOCKER_HUB_REPO = 'malinda6997/gemini-clone'
        EC2_HOST = '3.83.237.199'
        IMAGE_TAG = "v${BUILD_NUMBER}"
    }
    
    stages {
        stage('1️⃣ Build Docker Image') {
            steps {
                script {
                    echo "🔨 Building Docker image..."
                    echo "📦 Image: ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    sh "docker build -t ${DOCKER_HUB_REPO}:${IMAGE_TAG} ."
                    sh "docker tag ${DOCKER_HUB_REPO}:${IMAGE_TAG} ${DOCKER_HUB_REPO}:latest"
                    echo "✅ Docker image built successfully!"
                }
            }
        }
        
        stage('2️⃣ Login to Docker Hub') {
            steps {
                script {
                    echo "🔐 Logging into Docker Hub..."
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                    usernameVariable: 'DOCKER_USER', 
                                                    passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin"
                        echo "✅ Successfully logged into Docker Hub!"
                    }
                }
            }
        }
        
        stage('3️⃣ Push to Docker Hub') {
            steps {
                script {
                    echo "📤 Pushing images to Docker Hub..."
                    sh "docker push ${DOCKER_HUB_REPO}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO}:latest"
                    echo "✅ Images pushed successfully!"
                    echo "🏷️  Tagged: ${IMAGE_TAG} & latest"
                }
            }
        }
        
        stage('4️⃣ Deploy to EC2') {
            steps {
                script {
                    echo "🚀 Deploying to EC2 server..."
                    echo "🌐 Target: ${EC2_HOST}"
                    sshagent(['ec2-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                echo "🛑 Stopping old container..."
                                docker stop gemini-container || true
                                docker rm gemini-container || true
                                
                                echo "🧹 Cleaning old images..."
                                docker rmi ${DOCKER_HUB_REPO}:latest || true
                                
                                echo "📥 Pulling latest image..."
                                docker pull ${DOCKER_HUB_REPO}:latest
                                
                                echo "▶️  Starting new container..."
                                docker run -d --name gemini-container -p 80:5173 --restart unless-stopped ${DOCKER_HUB_REPO}:latest
                                
                                echo "✅ Verifying deployment..."
                                docker ps | grep gemini-container
                                echo "🎉 Deployment completed!"
                            '
                        """
                    }
                    echo "✅ Successfully deployed to EC2!"
                }
            }
        }
        
        stage('5️⃣ Cleanup & Verify') {
            steps {
                script {
                    echo "🧹 Cleaning up local resources..."
                    sh "docker logout"
                    sh "docker rmi ${DOCKER_HUB_REPO}:${IMAGE_TAG} || true"
                    sh "docker rmi ${DOCKER_HUB_REPO}:latest || true"
                    
                    echo "🔍 Final verification..."
                    echo "📊 Deployment Summary:"
                    echo "   🏷️  Version: ${IMAGE_TAG}"
                    echo "   🌐 URL: http://${EC2_HOST}"
                    echo "   📦 Image: ${DOCKER_HUB_REPO}:latest"
                    echo "   📅 Time: ${new Date()}"
                    echo "✅ Pipeline completed successfully!"
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