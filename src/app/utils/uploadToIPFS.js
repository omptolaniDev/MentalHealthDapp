export async function uploadTextToIPFS(data) {
  const jwt = process.env.NEXT_PUBLIC_PINATA_JWT;

  if (!jwt) {
    throw new Error("Pinata JWT is not defined. Make sure it's in your .env.local file.");
  }

  try {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ` ${jwt}`, // 
      },
      body: JSON.stringify({
        pinataContent: data, //
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Upload failed:", errorData);
      throw new Error(`Upload failed: ${errorData.error || res.statusText}`);
    }

    const result = await res.json();
    return result.IpfsHash;
  } catch (error) {
    console.error("IPFS upload error:", error);
    throw error;
  }
}
