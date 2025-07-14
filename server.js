// 필요한 라이브러리들을 불러옵니다.
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path'); // 1. 파일 경로 관리를 위한 'path' 라이브러리 추가

// Express 앱을 생성합니다.
const app = express();

// Render와 같은 호스팅 서비스에서 제공하는 포트 또는 기본 3000번 포트를 사용합니다.
const PORT = process.env.PORT || 3000;

// CORS 미들웨어를 사용하여 모든 도메인에서의 요청을 허용합니다.
app.use(cors());

// --- 2. 정적 파일 제공 설정 추가 ---
// 'www' 라는 이름의 폴더에 있는 파일들을 웹사이트의 루트 경로로 제공합니다.
// 예를 들어, 사용자가 홈페이지에 접속하면 'www/index.html'을 보여줍니다.
app.use(express.static(path.join(__dirname, 'www')));
// ------------------------------------

// '/api/lookup' 경로로 GET 요청이 오면 처리할 라우트입니다.
app.get('/api/lookup', async (req, res) => {
    // ... (기존 API 처리 코드는 변경 없음)
    const { blType, blNo, blYear, apiKey } = req.query;
    const serviceUrl = 'https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo';
    const params = {
        crky: apiKey,
        cargMtNo: blType === 'master' ? blNo : '',
        mblNo: blType === 'master' ? blNo : '',
        hblNo: blType === 'house' ? blNo : '',
        blYy: blYear,
    };

    try {
        const response = await axios.get(serviceUrl, { params });
        res.header('Content-Type', 'application/xml');
        res.send(response.data);
    } catch (error) {
        console.error('API 요청 중 에러 발생:', error.message);
        res.status(500).json({ message: '관세청 API 서버 요청에 실패했습니다.' });
    }
});

// 지정된 포트에서 서버를 실행합니다.
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});