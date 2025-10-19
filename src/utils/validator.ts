import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export async function validateDto<T extends object>(dtoClass: new () => T, data: any): Promise<T> {
    const dtoInstance = plainToInstance(dtoClass, data);
    const errors: ValidationError[] = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
    });

    if (errors.length > 0) {
        const messages = errors.flatMap(error => Object.values(error.constraints || {}));
        
        const error = new Error('Validation failed');
        (error as any).statusCode = 400;
        (error as any).details = messages;
        throw error;
    }

    return dtoInstance;
}
