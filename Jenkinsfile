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
                    sh '''
                    export $(cat .env | xargs)  # 환경 변수 설정
                    npm install -g pnpm  # 🔹 pnpm 설치 추가
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'pnpm install'  // pnpm을 사용하여 의존성 설치
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'pnpm run build'  // 빌드 실행
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'  // Docker 이미지 빌드
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
