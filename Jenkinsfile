pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'malinda699/gemini-app'
        EC2_HOST = '3.84.213.89'
    }
    
    stages {
        stage('1. Create Docker Image') {
            steps {
                sh 'docker build -t ${DOCKER_IMAGE} .'
                echo 'Docker image created'
            }
        }
        
        stage('2. Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'Docker-Hub-Password', variable: 'DockerHubPassword')]) {
                    sh 'echo $DockerHubPassword | docker login -u malinda699 --password-stdin'
                    sh 'docker push ${DOCKER_IMAGE}'
                    sh 'docker logout'
                }
                echo 'Image pushed to Docker Hub'
            }
        }
        
        stage('3. Pull to Server') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} "
                            docker pull ${DOCKER_IMAGE}
                        "
                    '''
                }
                echo 'Image pulled to server'
            }
        }
        
        stage('4. Create Docker Container') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} "
                            docker stop gemini-app || true
                            docker rm gemini-app || true
                            docker run -d --name gemini-app -p 80:5173 ${DOCKER_IMAGE}
                        "
                    '''
                }
                echo 'Container created'
            }
        }
        
        stage('5. Deploy') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} "
                            docker ps | grep gemini-app
                        "
                    '''
                }
                echo 'App deployed at http://${EC2_HOST}'
            }
        }
    }
}