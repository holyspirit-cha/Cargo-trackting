# Node.js 18 이미지 사용
FROM node:18

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# 의존성 설치
COPY package.json ./
RUN npm install

# 소스 복사
COPY . .

# 3000번 포트 사용
EXPOSE 3000

# 앱 실행
CMD ["npm", "start"]