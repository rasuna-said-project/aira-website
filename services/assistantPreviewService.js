export async function getAssistantPreviewResponse(question) {
  // Simulasi waktu pemrosesan AI
  await new Promise((resolve) => setTimeout(resolve, 900));

  return {
    content:
      "Terima kasih atas pertanyaannya! AIRA Assistant sedang berada dalam tahap pengembangan tampilan. Nantinya saya akan membantu menjawab pertanyaan berdasarkan basis pengetahuan AIRA mengenai ketahanan air, penghematan air, kebersihan menstruasi, dan sanitasi keluarga.",
    topics: [],
  };
} 