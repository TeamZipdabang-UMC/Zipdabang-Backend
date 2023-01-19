import app from './config/express'
import privateInfo from './config/privateInfo'

app.listen(privateInfo.PORT, () => console.log(`temp server is on http://localhost:${privateInfo.PORT}`));
