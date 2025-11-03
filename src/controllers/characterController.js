import { getCharacterProfile } from "../services/blizzardService.js";

export async function syncCharacter(req, res) {
    try {
        const { region, realm, character } = req.body;
        const data = await getCharacterProfile(region, realm, character);
        res.status(200).json({ status: "success", data });
    } catch (err) {
        console.error("❌ Error in syncCharacter:", err);
        res.status(500).json({ status: "error", message: err.message });
    }
}
