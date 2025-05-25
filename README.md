# 게시판 웹 애플리케이션 (Board App)

# 프로젝트 설명
- Node.js(Express) + MongoDB 백엔드
- React.js 프론트엔드
- Google OAuth2 + JWT 기반 로그인 인증
- Docker와 Docker Compose를 활용한 개발환경 통합

# 실행 방법

## 1. 레포지토리 클론
git clone https://github.com/hyukminlee/board-app.git

cd board-app

## 2. .env 파일 생성
.env.example 파일을 참고하여 프로젝트 루트에 .env 파일을 생성하고 다음 내용을 채워주세요.

MONGO_URI=mongodb://mongo:27017/board-app
JWT_SECRET=본인의_비밀키
GOOGLE_CLIENT_ID=본인의_구글_클라이언트_ID
GOOGLE_CLIENT_SECRET=본인의_구글_클라이언트_SECRET
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET은 Google Cloud Console에서 발급받을 수 있습니다.

## 3. Docker Compose로 프로젝트 실행
docker-compose up --build