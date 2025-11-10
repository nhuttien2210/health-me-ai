export type HttpErrorResponse<Resp = unknown> = {
    response: Response;
    data: Resp;
}