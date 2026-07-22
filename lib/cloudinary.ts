export function getBlurPlaceholder(cloudinaryUrl: string): string {
    return cloudinaryUrl.replace("/upload/", "/upload/w_16,q_10,e_blur:1000/");
}