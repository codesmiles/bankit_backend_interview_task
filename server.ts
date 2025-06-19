import { app } from "./src"

const PORT = process.env.PORT ?? 3005;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});