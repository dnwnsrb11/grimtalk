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

        stage('Setup pnpm') {
            steps {
                sh '''
                echo "🛠️ pnpm 설치 확인..."
                if ! command -v pnpm &> /dev/null
                then
                    echo "📦 pnpm이 설치되지 않았습니다. 설치를 진행합니다..."
                    npm install -g pnpm
                else
                    echo "✅ pnpm이 이미 설치되어 있습니다."
                fi
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                echo "📦 Installing dependencies with pnpm..."
                pnpm install
                echo "⚡ Building frontend with pnpm..."
                pnpm build
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Deploy (Frontend Only)') {
            steps {
                sshagent(['ubuntu-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@i12d202.p.ssafy.io << 'EOF'
                    
                    cd /home/ubuntu

                    echo "🛑 기존 프론트엔드 컨테이너 삭제"
                    docker stop frontend || true
                    docker rm frontend || true

                    echo "🗑️ 불필요한 Docker 이미지 및 볼륨 삭제"
                    docker rmi $(docker images -f "dangling=true" -q) || true
                    docker volume prune -f

                    echo "🚀 프론트엔드 컨테이너만 다시 실행"
                    docker-compose up -d --build frontend

                    echo "✅ 프론트엔드 배포 완료! 현재 컨테이너 상태:"
                    docker ps -a
                    
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
