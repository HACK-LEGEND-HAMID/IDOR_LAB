# 🔥 IDOR MASTER LABORATORY 🔥

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzF0bHh0eXJ6eGZvZzF0bHh0eXJ6eGZvZzF0bHh0eXJ6eGZvZiZjdD1n/3o7abKhOpu0NwenJ3O/giphy.gif" width="400" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=28&duration=3000&pause=500&color=F75C7E&center=true&vCenter=true&width=700&lines=%F0%9F%94%A5+28+IDOR+Vulnerabilities+%F0%9F%94%A5;Beginner+%E2%86%92+Expert+Level+%F0%9F%93%88;URL+%7C+POST+%7C+JSON+%7C+Headers+%7C+JWT;Cookies+%7C+OAuth+%7C+GraphQL+%7C+WebSocket;UUID+%7C+Bulk+Ops+%7C+Admin+Panel+%7C+More!;Production-Grade+Simulation+%F0%9F%8F%A6" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/VULNERABILITIES-28-red?style=for-the-badge&logo=owasp&logoColor=white" />
  <img src="https://img.shields.io/badge/LEVELS-4-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/MADE_WITH-Vanilla_JS-FFD43B?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/STYLE-Dark_Mode-000?style=for-the-badge" />
</p>


---

## 🎭 **WHAT IS THIS?**

<p align="center">
  <img src="https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif" width="500" />
</p>

---



## 🗺️ **THE 28 IDOR PARAMETERS MAP**



### 🟢 **LEVEL 1 — BEGINNER** (Easy to Spot)

| # | Technique | Endpoint Pattern |
|---|-----------|-----------------|
| 1 | **URL Path** | `/profile/1001` → `/profile/1002` |
| 2 | **Query String** | `?user_id=1001` → `?user_id=1002` |
| 3 | **Sequential IDs** | `ORD-001` → `ORD-002` |
| 4 | **Incremental Nums** | `/docs/1` → `/docs/2` |

### 🟡 **LEVEL 2 — INTERMEDIATE** (Hidden & Encoded)

| # | Technique | Endpoint Pattern |
|---|-----------|-----------------|
| 5 | **POST Body** | `user_id=1001` in form data |
| 6 | **JSON Body** | `{"user_id": 1001}` → `{"user_id": 1002}` |
| 7 | **Base64 Encoded** | `/user/MTAwMQ==` (decode→modify→encode) |
| 8 | **Hidden Fields** | `<input type="hidden" name="user_id">` |

### 🟠 **LEVEL 3 — ADVANCED** (Headers, Cookies, Tokens)

| # | Technique | Endpoint Pattern |
|---|-----------|-----------------|
| 9 | **Custom Headers** | `X-User-ID: 1001` |
| 10 | **Cookies** | `user_id=1001` (unsigned) |
| 11 | **JWT Payload** | `{"sub":"alice_1001"}` → modify & re-sign |
| 12 | **OAuth Tokens** | `tok_1001_rw_profile` → `tok_1002_rw_profile` |
| 13 | **Referer Header** | Trusts `Referer: /admin` |
| 14 | **GraphQL** | `{ user(id: 1001) { email } }` |
| 15 | **WebSocket** | `{"target_user": 1001}` |

### 🔴 **LEVEL 4 — EXPERT** (Enumeration, Escalation, Forgery)

| # | Technique | Endpoint Pattern |
|---|-----------|-----------------|
| 16 | **UUID/GUID** | Predictable UUID v1 suffixes |
| 17 | **File Names** | `user1001_report.pdf` → `user1002_report.pdf` |
| 18 | **API Enumeration** | Sequential order ID scanning |
| 19 | **Bulk Operations** | `[1001, 1002, 1003]` in array |
| 20 | **Nested JSON** | `{"order": {"user_id": 1001}}` |
| 21 | **Array Params** | `?user_id[]=1&user_id[]=2` |
| 22 | **Admin Panel** | `/admin/users/1001` (no isAdmin check) |
| 23 | **API Keys** | `/api/keys/201` → `/api/keys/202` |
| 24 | **Reset Tokens** | MD5(uid+timestamp) — forgeable |
| 25 | **Invoice URLs** | `INV-0042.pdf` → `INV-0001.pdf` |
| 26 | **Message IDs** | `/messages/5001` → `/messages/5002` |
| 27 | **Role IDs** | `role_id=1` → `role_id=3` (enterprise) |
| 28 | **Hashed IDs** | MD5 of small int → rainbow table |

---

## 🚀 **QUICK START**

**link:**https://idor-lab.pages.dev

---
<p align="center"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" /> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" /> <img src="https://img.shields.io/badge/Vanilla-100%25-green?style=for-the-badge" /> </p>
