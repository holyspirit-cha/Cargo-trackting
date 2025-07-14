// 필요한 라이브러리들을 불러옵니다.
const express = require('express'); // 웹 서버를 위한 Express
const axios = require('axios');   // 외부 API 요청을 위한 Axios
const cors = require('cors');     // CORS 문제를 해결하기 위한 CORS 미들웨어

// Express 앱을 생성합니다.
const app = express();

// Render와 같은 호스팅 서비스에서 제공하는 포트 또는 기본 3000번 포트를 사용합니다.
const PORT = process.env.PORT || 3000;

// CORS 미들웨어를 사용하여 모든 도메인에서의 요청을 허용합니다.
// 이렇게 하면 Capacitor 앱에서 서버로 요청을 보낼 때 차단되지 않습니다.
app.use(cors());

// '/api/lookup' 경로로 GET 요청이 오면 처리할 라우트입니다.
app.get('/api/lookup', async (req, res) => {
    // 1. 클라이언트(앱)에서 보낸 쿼리 파라미터를 추출합니다.
    const { blType, blNo, blYear, apiKey } = req.query;

    // 2. 관세청 Open API의 실제 주소를 설정합니다.
    const serviceUrl = 'https://unipass.customs.go.kr:38010/ext/rest/cargCsclPrgsInfoQry/retrieveCargCsclPrgsInfo';

    // 3. API 요청에 필요한 파라미터를 객체로 만듭니다.
    const params = {
        crky: apiKey, // 인증키
        cargMtNo: blType === 'master' ? blNo : '', // Master B/L일 경우 화물관리번호
        mblNo: blType === 'master' ? blNo : '', // Master B/L 번호
        hblNo: blType === 'house' ? blNo : '', // House B/L 번호
        blYy: blYear, // B/L 연도
    };

    try {
        // 4. Axios를 사용해 관세청 API에 GET 요청을 보냅니다.
        const response = await axios.get(serviceUrl, { params });

        // 5. 관세청 서버로부터 받은 XML 데이터를 클라이언트에 그대로 전달합니다.
        res.header('Content-Type', 'application/xml');
        res.send(response.data);

    } catch (error) {
        // 6. 에러가 발생하면 콘솔에 로그를 남기고, 클라이언트에는 500 에러를 보냅니다.
        console.error('API 요청 중 에러 발생:', error.message);
        res.status(500).json({ message: '관세청 API 서버 요청에 실패했습니다.' });
    }
});

// 지정된 포트에서 서버를 실행합니다.
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
