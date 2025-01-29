pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git',
                    credentialsId: 'gitlab-credentials'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                npm install -g pnpm || true  # pnpm이 없으면 설치
                pnpm install
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'pnpm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker stop frontend || true
                docker rm frontend || true
                docker run -d --name frontend -p 80:80 $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo 'Frontend Deployment Successful!'
        }
        failure {
            echo 'Frontend Deployment Failed.'
        }
    }
}
