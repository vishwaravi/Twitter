import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import { getCurrentUserId } from "../utils/auth";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Name of the Supabase Storage bucket where images will be stored.
// Ensure this bucket exists in your Supabase project and is set to public if you want public URLs.
export const SUPABASE_BUCKET = import.meta.env.VITE_SUPABASE_BUCKET || "uploads";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Upload an image file to Supabase Storage and return its public URL.
 *
 * Contract:
 * - input: File object (image), optional folder string (e.g., "posts", "avatars")
 * - output: public URL string
 * - throws: Error with message when upload fails
 */
export async function uploadImageToSupabase(file, folder = "posts") {
	if (!file) throw new Error("No file provided for upload");
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error("Supabase is not configured. Missing URL or anon key.");
	}

	// Derive extension and build a unique path: {folder}/{userId}/{nanoid}.{ext}
	const extFromName = file.name?.split(".").pop()?.toLowerCase() || "bin";
	const safeExt = extFromName.split("?")[0].split("#")[0];
	const userId = (getCurrentUserId() || "anon").toString();
	const objectPath = `${folder}/${userId}/${nanoid()}.${safeExt}`;

	const { error: uploadError } = await supabase
		.storage
		.from(SUPABASE_BUCKET)
		.upload(objectPath, file, {
			cacheControl: "3600",
			upsert: false,
			contentType: file.type || undefined,
		});

	if (uploadError) {
		throw new Error(uploadError.message || "Failed to upload image to Supabase");
	}

	const { data } = supabase.storage.from(SUPABASE_BUCKET).getPublicUrl(objectPath);
	if (!data?.publicUrl) {
		throw new Error("Failed to retrieve public URL for uploaded image");
	}
	return data.publicUrl;
}

