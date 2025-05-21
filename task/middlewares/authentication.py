import jwt
from django.conf import settings
from django.http import JsonResponse

from task.models import TblUser


class AuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request, *args, **kwargs):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            jwt_token = auth_header[len('Bearer '):]
            try:
                access_token = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
                user_id = access_token.get('user_id')
                if not user_id:
                    return JsonResponse({"data": {
                        "errors": "Invalid token: No member is present",
                        "message": "Authentication error",
                        "status": False
                    }}, status=400)

                self.validate_token(user_id, access_token, request)
            except jwt.ExpiredSignatureError:
                return JsonResponse({"data": {
                    "errors": "Token expired,",
                    "message": "Authentication error",
                    "status": False
                }}, status=401)

        return self.get_response(request)

    def validate_token(self, user_id, access_token_payload, request):
        try:
            type = access_token_payload.get('type')
            if type != 'access':
                raise jwt.InvalidTokenError('Invalid token type')
            if user_id:
                user = TblUser.objects.get(pk=user_id)
                if not user.is_active:
                    raise jwt.InvalidTokenError('Invalid token')
                request.user = user
        except jwt.ExpiredSignatureError:
            raise Exception('Token expired')
        except jwt.InvalidTokenError as e:
            print('gvhcjfdhbdvmvbdfvgbh')
            raise Exception(f'Invalid token: {str(e)}')



