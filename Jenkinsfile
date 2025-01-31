pipeline {
    agent any

    environment {
        COMPOSE_FILE_PATH = "/home/ubuntu/docker-compose.yml"
        IMAGE_NAME = "frontend-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git', credentialsId: 'gitlab-credentials'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Deploy') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@i12d202.p.ssafy.io <<EOF
                    cd /home/ubuntu
                    docker-compose down
                    docker-compose up -d --build
                    EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ Frontend Deployment Successful!'
        }
        failure {
            echo '❌ Frontend Deployment Failed.'
        }
    }
}
