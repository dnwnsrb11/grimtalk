pipeline {
    agent any

    environment {
        IMAGE_NAME = "frontend-app"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://lab.ssafy.com/hoonixox/grimtalkfront.git', credentialsId: 'gitlab-credentials'
            }
        }

        stage('Setup Environment') {
            steps {
                configFileProvider([configFile(fileId: 'env-file', targetLocation: '.env')]) {
                    sh 'export $(cat .env | xargs)'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'  // 🔥 Dockerfile을 사용해 빌드
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
