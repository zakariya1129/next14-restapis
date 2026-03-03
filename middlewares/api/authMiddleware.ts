const validate = (token:any) => {
    const validToken = true;
    if(!validToken || !token){
        return false;
    }
    return true;
};


export default function authMiddleware(request: Request) :any {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    return { isValid : validate(token)};
}