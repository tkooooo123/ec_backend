import fetch from "node-fetch";
import FormData from "form-data";
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

export const cloudinaryService = {
  uploadSingle: async (
    file: Buffer | string,
    fileName?: string,
  ): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file, fileName);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data: any = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || "Cloudinary 上傳失敗");
    }

    return data.secure_url;
  },
  uploadMultiple: async (files: (Buffer | string)[]): Promise<string[]> => {
    const results: string[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await cloudinaryService.uploadSingle(files[i]);
        results.push(url);
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`第 ${i + 1} 張圖片上傳失敗: ${error.message}`);
        }
        throw new Error(`第 ${i + 1} 張圖片上傳失敗`);
      }
    }

    return results;
  },
};
