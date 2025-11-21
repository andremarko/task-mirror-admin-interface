import { loginUser } from '../fetcher/loginFetcher';
import { LoginRequestDTO, LoginResponseDTO } from '../model/login';

export const loginService = {
    login: async(loginData: LoginRequestDTO): Promise<LoginResponseDTO> => {
        const response = await loginUser(loginData);
        return response;
    }
}
