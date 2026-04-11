const API_TIMEOUT = 30000;

export async function callBackend(endpoint, payload = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch("/api/telegram/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        endpoint,
        method: "POST",
        payload,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed [${response.status}]`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
}

export const api = {
  createSession: (phone, code, password) =>
    callBackend("/sessions/create", { phone, code, password }),

  getSessions: () => callBackend("/sessions/list"),

  deleteSession: (name) => callBackend("/sessions/delete", { name }),

  checkStatus: () => callBackend("/sessions/status"),

  joinGroups: (links, mute, archive) =>
    callBackend("/channels/join", { links, mute, archive }),

  leaveGroups: (targets) => callBackend("/channels/leave", { targets }),

  referralBot: (botUsername, refCode) =>
    callBackend("/bot/referral", {
      bot_username: botUsername,
      ref_code: refCode,
    }),

  sendMessage: (botUsername, message, mode) =>
    callBackend("/bot/send-message", {
      bot_username: botUsername,
      message,
      mode,
    }),

  clickInline: (botUsername) =>
    callBackend("/bot/click-inline", { bot_username: botUsername }),

  mathQuiz: (botUsername, mode) =>
    callBackend("/bot/math-quiz", { bot_username: botUsername, mode }),

  sendReaction: (messageLink, emojis, mode) =>
    callBackend("/bot/reaction", { message_link: messageLink, emojis, mode }),

  editName: (mode, newText) =>
    callBackend("/account/edit-name", { mode, new_text: newText }),

  chatSettings: (mode, targets) =>
    callBackend("/account/chat-settings", { mode, targets }),

  set2FA: (password, hint) =>
    callBackend("/account/set-2fa", { password, hint }),

  getOTP: (identifier) => callBackend("/account/get-otp", { identifier }),

  extractInitData: (dappUrl, botUsername, outputMode) =>
    callBackend("/data/extract-initdata", {
      dapp_url: dappUrl,
      bot_username: botUsername,
      output_mode: outputMode,
    }),

  giveawayHunter: () => callBackend("/channels/giveaway"),

  autoChat: (botUsername, mode, customText) =>
    callBackend("/bot/auto-chat", {
      bot_username: botUsername,
      mode,
      custom_text: customText,
    }),
};
