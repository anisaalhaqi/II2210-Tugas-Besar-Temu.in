import random
import uuid
from datetime import datetime, timedelta

users = [
    ("24685976-9721-4eb9-ac16-9cfb18393ac9", "rizkyf23", "Rizky Putri Kusuma"),
    ("169ee32b-b546-4bd4-8483-eef39a28ec7d", "nadyapk", "Nadya Wicaksono"),
    ("47065d79-30f4-4e45-b389-67464723e555", "bagas_w", "Bagas Pratama"),
    ("b886c335-f5d2-4262-9555-c5c69f06c261", "the.real.dito", "Dito Hidayat"),
    ("bc750b17-f47f-410e-81c8-4ebb7d1c99c2", "fadhil_h", "Fadhil Lestari"),
    ("4b90b786-482f-44df-bea2-f9a4d55cea24", "ayu.lestari", "Ayu Saputra"),
    ("12b051e1-a944-4075-9074-450d5c47e1b4", "dimas_pratama", "Dimas Ramadhani"),
    ("2f3be25b-648f-4d4b-9b1c-ca3e59743253", "salsa.bil", "Salsabila Iskandar"),
    ("2c5b997f-fadd-4722-b8e8-ce16a5b1ed30", "zaki_isk", "Zaki Sari"),
    ("4dab0120-2d43-4213-8b51-cf83421a08b1", "anisa_sari", "Anisa Gunawan"),
    ("92f7b1da-5c5c-48a9-9019-73377efd7b16", "kevin.g", "Kevin Utami"),
    ("677dc151-c63d-40d7-ac9b-2a2e6156c70d", "laras_ut", "Laras Siregar"),
    ("3f3da1f0-5ad5-4a1f-bbb2-945ce44ed4a4", "farhan_sir", "Farhan Permata"),
    ("8da60c79-a727-4846-8744-41c09307ac7d", "tiarapermata", "Tiara Santoso"),
    ("b4c85712-bc1c-4974-8757-bb05bd85afd1", "arif_santos", "Arif Wijaya"),
    ("59a36309-e51b-400a-99f1-cfd4ad860b76", "hana_wijaya", "Hana Kusuma"),
    ("aca8eb44-6170-4a64-9cfe-d3fd60fb4269", "raka_kusuma", "Raka Aulia"),
    ("7b8b5c0f-f7f9-41fb-bb7f-3c49237dc6a5", "maya_aulia", "Maya Prasetyo"),
    ("72838548-158c-4369-b307-1e907b9f12f3", "eko_pras", "Eko Wulandari"),
    ("50c249a0-c5be-442e-b56c-a604ae056500", "santi_wulan", "Santi Firmansyah"),
    ("6ac5f17f-3892-4287-b049-5a9235d0a7e8", "taufik_h", "Taufik Putri Kusuma"),
    ("028d56af-1ba7-4ff2-a599-39dcb7d1fd13", "vina_l", "Vina Wicaksono"),
    ("290d4f3c-db86-416f-9fc0-d80230cf7429", "wawan_s", "Wawan Pratama"),
    ("910fa170-6a3e-49eb-9a20-d723005fd5e5", "putri_r", "Putri Hidayat"),
    ("f96f6cc3-695f-4941-af27-59b9f3a68759", "yanto_w", "Yanto Lestari"),
    ("b24fc325-fcba-4fb9-9e85-0cfb3b393b80", "indah_s", "Indah Saputra"),
    ("ced1757a-351b-47e9-bfe9-de7f8ce0f115", "budi_p", "Budi Ramadhani"),
    ("5a17eba6-dc7a-4dfe-a6e5-3e474d73a201", "citra_k", "Citra Iskandar"),
    ("17f7a776-89df-48a8-9c6c-af226f9cc95e", "adit_m", "Adit Sari"),
    ("6c9054d7-f023-48b0-af78-953ebc4064b2", "gita_a", "Gita Gunawan")
]

products = [
    ("3dff2273-7187-45bb-8cbe-a5ac5e17234b", "Calculus Early Transcendentals Stewart Edisi 8", "50c249a0-c5be-442e-b56c-a604ae056500", "available"),
    ("c913b0a6-cde2-4aa5-b2e0-9e292c07d165", "Kimia Dasar Oxtoby Jilid 1", "910fa170-6a3e-49eb-9a20-d723005fd5e5", "available"),
    ("a81c4cc6-e21c-4d71-bca3-891c4f26e678", "Buku Ajar Mekanika Fluida ITB", "f96f6cc3-695f-4941-af27-59b9f3a68759", "available"),
    ("d8c684dd-46e1-49c1-b6bf-722a0ee37ca9", "Algoritma dan Pemrograman Rinaldi Munir", "47065d79-30f4-4e45-b389-67464723e555", "available"),
    ("80d9bdea-5a49-485d-896e-b3ecc83f4533", "Purcell Calculus 9th Edition", "3f3da1f0-5ad5-4a1f-bbb2-945ce44ed4a4", "sold"),
    ("48b36eb0-92e1-4aee-916a-38abb37fa633", "Diktat Kuliah Fisika Dasar TPB", "24685976-9721-4eb9-ac16-9cfb18393ac9", "available"),
    ("97b51c00-3ce4-4b44-b2b0-7f51a46e27d8", "Biologi Campbell Edisi 11 Bahasa Indo", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "reserved"),
    ("83d78f1d-87d9-4f87-b04a-a23f10de1413", "Manajemen Keuangan Gitman", "92f7b1da-5c5c-48a9-9019-73377efd7b16", "available"),
    ("5cec2c03-0a43-4f55-a021-b23895836a7b", "Pengantar Rekayasa Desain SAPPK", "290d4f3c-db86-416f-9fc0-d80230cf7429", "available"),
    ("fbed5856-0132-4539-a9ba-f8ed6831d83e", "Kumpulan Soal UTS UAS STEI", "8da60c79-a727-4846-8744-41c09307ac7d", "sold"),
    ("cb70080c-7810-4dc5-b9ca-8ed0e2710716", "Laptop ASUS VivoBook 14 A416 RAM 8GB", "ced1757a-351b-47e9-bfe9-de7f8ce0f115", "available"),
    ("16779ee4-6f66-40cd-84c7-20a4d094e6d1", "Kalkulator Casio fx-991EX ClassWiz", "2c5b997f-fadd-4722-b8e8-ce16a5b1ed30", "available"),
    ("dfe9b41f-649a-4b3f-a1c3-e2db699a1e24", "Drawing Tablet Wacom CTL-472", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "available"),
    ("85850114-2d65-4319-8506-5de841b22b1b", "Earphone Sony WF-C500 Black", "24685976-9721-4eb9-ac16-9cfb18393ac9", "reserved"),
    ("ffd2a219-0ca8-4676-97ae-8025bc7c905f", "Charger MacBook 61W USB-C Original", "92f7b1da-5c5c-48a9-9019-73377efd7b16", "sold"),
    ("f9da772c-238e-43f0-a0ce-6ddab73e9bbe", "Mouse Logitech G102 Lightsync", "4dab0120-2d43-4213-8b51-cf83421a08b1", "available"),
    ("87f12a8d-dadf-4dfa-8c50-bdc4e376c350", "Monitor Samsung 24 Inch Curved", "aca8eb44-6170-4a64-9cfe-d3fd60fb4269", "available"),
    ("156520a8-fac5-4c7f-8f80-7996e1dbc000", "Arduino Uno R3 Starter Kit", "50c249a0-c5be-442e-b56c-a604ae056500", "available"),
    ("d3655635-29c5-4fd4-b620-2f3872aaf166", "RAM Laptop 8GB DDR4 Sodimm", "59a36309-e51b-400a-99f1-cfd4ad860b76", "available"),
    ("891c4718-9951-4d8b-bea3-9c0756e8b452", "Powerbank Anker 10000mAh", "028d56af-1ba7-4ff2-a599-39dcb7d1fd13", "sold"),
    ("75051618-6026-4e7b-9385-477cf63eb2af", "Rapido Rotring Isograph 0.1/0.2/0.3 set", "f96f6cc3-695f-4941-af27-59b9f3a68759", "reserved"),
    ("9b9dd600-dd5e-4afb-a883-90ad9651ad77", "Pensil Mekanik Pentel GraphGear 1000", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "available"),
    ("d56621ee-75e0-412e-a209-95c1939e64d3", "Cat Poster Talens set 12 warna", "ced1757a-351b-47e9-bfe9-de7f8ce0f115", "available"),
    ("46cf0f26-b893-47d2-93e3-f8bf73f90fcc", "Fineliner Staedtler set 8 warna", "92f7b1da-5c5c-48a9-9019-73377efd7b16", "available"),
    ("3c960ccb-9ce5-4194-8e17-a098b7200a39", "Drawing Pen Snowman set 0.1-0.8", "b24fc325-fcba-4fb9-9e85-0cfb3b393b80", "sold"),
    ("c2b91b80-4181-4cac-9757-869bbc48bc83", "Sketchbook Canson A4 200gsm", "17f7a776-89df-48a8-9c6c-af226f9cc95e", "available"),
    ("aee60b63-48c4-4490-a392-299396135bc3", "Set Penggaris Segitiga Rotring Besar", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "available"),
    ("2b4a1713-51b7-4c64-8c46-ee8f31746ced", "Kuas Lukis Eterna set 5", "290d4f3c-db86-416f-9fc0-d80230cf7429", "reserved"),
    ("d7fb36e6-b8e3-446f-ba98-3205e76b92ee", "Busur Derajat Besi 180", "b4c85712-bc1c-4974-8757-bb05bd85afd1", "available"),
    ("a5fa8fa9-c6d9-4eea-8f5a-8acd16a14a8f", "Cutter Olfa Heavy Duty", "72838548-158c-4369-b307-1e907b9f12f3", "sold"),
    ("1e0db1ad-1c9c-4bfc-8ff1-398e5c8515e5", "Jas Lab ukuran M kondisi baik", "b24fc325-fcba-4fb9-9e85-0cfb3b393b80", "available"),
    ("f0b20fe7-6d65-4def-a7b2-8e1e1d28e752", "Goggles Lab merk Kimberly-Clark", "f96f6cc3-695f-4941-af27-59b9f3a68759", "available"),
    ("7e6f46d2-4a7b-4c78-97e0-cf5f2aa758ab", "Kemeja Putih Polos Buat Magang", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "available"),
    ("0fcbb24f-24a3-4033-95c3-67c7b4f62bf8", "Sepatu Safety Krisbow Ori", "910fa170-6a3e-49eb-9a20-d723005fd5e5", "available"),
    ("1cd8c766-f3b9-466b-bf52-f880627061f8", "Kaos ITB Ganesha Navy", "47065d79-30f4-4e45-b389-67464723e555", "sold"),
    ("0e456ac9-855b-42b1-8de4-a47284c7fd3d", "Tas Ransel Eiger 25L", "4b90b786-482f-44df-bea2-f9a4d55cea24", "available"),
    ("a9fa54f5-f0b2-4979-bf26-78f6467db8b2", "Jaket Angkatan Polos Hitam", "8da60c79-a727-4846-8744-41c09307ac7d", "available"),
    ("b7f6fd45-1e17-4624-8b2c-d588c4e291c2", "Sepatu Pantofel Pria 42", "50c249a0-c5be-442e-b56c-a604ae056500", "available"),
    ("664df8bc-b7f8-4554-9c58-50333781d286", "Toga Wisuda ITB (Sewa)", "5a17eba6-dc7a-4dfe-a6e5-3e474d73a201", "available"),
    ("6b623488-9528-4d56-8b56-0e23809bb508", "Dasi Hitam Instan", "17f7a776-89df-48a8-9c6c-af226f9cc95e", "sold"),
    ("fd25da5a-8f67-41b2-a42e-1e8c29d08b79", "Item Akademik #41", "4b90b786-482f-44df-bea2-f9a4d55cea24", "available"),
    ("77a58662-4bb1-4746-8281-22f71821563f", "Item Akademik #42", "aca8eb44-6170-4a64-9cfe-d3fd60fb4269", "reserved"),
    ("f98de496-bf8c-4035-9545-3560e5e7d4fc", "Item Akademik #43", "4b90b786-482f-44df-bea2-f9a4d55cea24", "available"),
    ("e839604e-ac96-4e66-a196-63c5803e4346", "Item Akademik #44", "17f7a776-89df-48a8-9c6c-af226f9cc95e", "available"),
    ("e78a4c24-090f-4843-af05-003f13845707", "Item Akademik #45", "72838548-158c-4369-b307-1e907b9f12f3", "sold"),
    ("fe36982f-847c-4794-93bb-dcac5ffb80ed", "Item Akademik #46", "24685976-9721-4eb9-ac16-9cfb18393ac9", "available"),
    ("eadd9a9e-7024-427a-8060-c40d1aed1ffb", "Item Akademik #47", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "available"),
    ("877e9947-35ba-481f-bfba-a51d69a50f35", "Item Akademik #48", "92f7b1da-5c5c-48a9-9019-73377efd7b16", "available"),
    ("d771b6f7-d5ad-4edc-aec0-3ca39c847c2f", "Item Akademik #49", "b4c85712-bc1c-4974-8757-bb05bd85afd1", "reserved"),
    ("5cbabd0d-38d7-45a3-9862-f963465cbe39", "Item Akademik #50", "b886c335-f5d2-4262-9555-c5c69f06c261", "sold"),
    ("042aed6d-61f0-4f60-8bdc-b84fc0355702", "Item Akademik #51", "50c249a0-c5be-442e-b56c-a604ae056500", "available"),
    ("80dee3b0-bb97-4949-bfda-b8d976237d85", "Item Akademik #52", "b886c335-f5d2-4262-9555-c5c69f06c261", "available"),
    ("1b973756-ad56-4291-88ea-14ee20944373", "Item Akademik #53", "50c249a0-c5be-442e-b56c-a604ae056500", "available"),
    ("bb1673b8-6888-4acf-89fc-de598e256505", "Item Akademik #54", "aca8eb44-6170-4a64-9cfe-d3fd60fb4269", "available"),
    ("382a1b62-f56e-4d7a-9d33-87753481eed6", "Item Akademik #55", "290d4f3c-db86-416f-9fc0-d80230cf7429", "sold"),
    ("98aa955a-6ee0-4d12-931e-db27d6a82d22", "Item Akademik #56", "2c5b997f-fadd-4722-b8e8-ce16a5b1ed30", "reserved"),
    ("e498484b-2823-48d5-8959-e27e33a0b562", "Item Akademik #57", "b24fc325-fcba-4fb9-9e85-0cfb3b393b80", "available"),
    ("83b73ac2-ffcb-4c96-bd0c-71eb6123e0e1", "Item Akademik #58", "24685976-9721-4eb9-ac16-9cfb18393ac9", "available"),
    ("3d8fc1a9-82b4-4597-83a6-17393208aa1f", "Item Akademik #59", "028d56af-1ba7-4ff2-a599-39dcb7d1fd13", "available"),
    ("a15341e9-7af6-4b02-b0ef-2c86f12c1580", "Item Akademik #60", "3f3da1f0-5ad5-4a1f-bbb2-945ce44ed4a4", "sold"),
    ("a1f722c2-7781-487c-b59a-ea38d839878d", "Item Akademik #61", "7b8b5c0f-f7f9-41fb-bb7f-3c49237dc6a5", "available"),
    ("1570f002-8a2a-465f-92fa-672ffce4fefb", "Item Akademik #62", "8da60c79-a727-4846-8744-41c09307ac7d", "available"),
    ("55e1c251-7cf2-40db-9be3-2918ab5845f7", "Item Akademik #63", "b886c335-f5d2-4262-9555-c5c69f06c261", "reserved"),
    ("466561f2-ee08-44b8-a0b6-8ccd59e003fb", "Item Akademik #64", "7b8b5c0f-f7f9-41fb-bb7f-3c49237dc6a5", "available"),
    ("4d4b854b-f443-40f8-9864-47e3a1d13dbf", "Item Akademik #65", "59a36309-e51b-400a-99f1-cfd4ad860b76", "sold"),
    ("8bac43d5-a766-447a-9599-bc4a6b13a127", "Item Akademik #66", "8da60c79-a727-4846-8744-41c09307ac7d", "available"),
    ("cb95964f-b4f9-4273-accf-44368b1ec33f", "Item Akademik #67", "4dab0120-2d43-4213-8b51-cf83421a08b1", "available"),
    ("ea70b94c-f516-40ee-a44d-d054ad854833", "Item Akademik #68", "47065d79-30f4-4e45-b389-67464723e555", "available"),
    ("9859e5d1-1901-4de7-9e0e-04e769df1780", "Item Akademik #69", "7b8b5c0f-f7f9-41fb-bb7f-3c49237dc6a5", "available"),
    ("b01e38b6-da97-4737-803b-d7d2beb403ce", "Item Akademik #70", "47065d79-30f4-4e45-b389-67464723e555", "sold"),
    ("ffd1f4a1-3955-40e4-9a80-134efd1341c2", "Item Akademik #71", "290d4f3c-db86-416f-9fc0-d80230cf7429", "available"),
    ("d68d789e-3f23-466a-9fcd-96172fc45e90", "Item Akademik #72", "59a36309-e51b-400a-99f1-cfd4ad860b76", "available"),
    ("02d3f48c-0b2a-4396-9742-2406146bb1b2", "Item Akademik #73", "169ee32b-b546-4bd4-8483-eef39a28ec7d", "available"),
    ("a75789ec-cd53-4bd0-9876-25965f4802f3", "Item Akademik #74", "24685976-9721-4eb9-ac16-9cfb18393ac9", "available"),
    ("8681aab0-7820-495a-96d9-d78e3a3959a6", "Item Akademik #75", "677dc151-c63d-40d7-ac9b-2a2e6156c70d", "sold"),
    ("327e6faf-e4bd-40e3-b9a8-fa6a0d042fe0", "Item Akademik #76", "4b90b786-482f-44df-bea2-f9a4d55cea24", "available"),
    ("1692fb7a-16b7-458a-ae12-132e1adee8bc", "Item Akademik #77", "290d4f3c-db86-416f-9fc0-d80230cf7429", "reserved"),
    ("b7a9d059-7057-4ced-87ac-685c267f3e71", "Item Akademik #78", "72838548-158c-4369-b307-1e907b9f12f3", "available"),
    ("eb7bafbe-0917-43a2-a047-b10a58659aa4", "Item Akademik #79", "b24fc325-fcba-4fb9-9e85-0cfb3b393b80", "available"),
    ("3abd0f9e-cdb1-4752-824e-4c215c448904", "Item Akademik #80", "92f7b1da-5c5c-48a9-9019-73377efd7b16", "sold")
]

output = []

# ==================== FAVORITES ====================
output.append("-- ==================== FAVORITES ====================")
fav_combinations = set()
favorites_count = 0

while favorites_count < 45:
    u = random.choice(users)[0]
    p = random.choice(products)[0]
    combo = (u, p)
    if combo not in fav_combinations:
        fav_combinations.add(combo)
        days_ago = random.randint(0, 30)
        output.append(f"INSERT INTO favorites (id, user_id, product_id, created_at) VALUES ('{str(uuid.uuid4())}', '{u}', '{p}', now() - interval '{days_ago} days');")
        favorites_count += 1

# ==================== CONVERSATIONS & MESSAGES ====================
output.append("-- ==================== CONVERSATIONS ====================")

conversations = []
for i in range(25):
    # Select product
    p = random.choice(products)
    p_id = p[0]
    seller_id = p[2]
    
    # Select buyer (must not be seller)
    possible_buyers = [u for u in users if u[0] != seller_id]
    buyer_id = random.choice(possible_buyers)[0]
    
    conv_id = str(uuid.uuid4())
    
    # Determine type
    if i < 8:
        ctype = "active"
        days_ago = random.randint(1, 3)
    elif i < 13:
        ctype = "nego"
        days_ago = random.randint(2, 5)
    elif i < 17:
        ctype = "order"
        days_ago = random.randint(4, 10)
    elif i < 22:
        ctype = "old"
        days_ago = random.randint(8, 30)
    else:
        ctype = "meetup"
        days_ago = random.randint(1, 4)
        
    last_msg_at = datetime.now() - timedelta(days=days_ago)
    
    if ctype == "order":
        output.append(f"-- AKAN DIPAKAI UNTUK ORDER: conversation ini lanjut ke transaksi")
        
    output.append(f"INSERT INTO conversations (id, product_id, buyer_id, seller_id, last_message_at, created_at) VALUES ('{conv_id}', '{p_id}', '{buyer_id}', '{seller_id}', '{last_msg_at.isoformat()}', '{last_msg_at.isoformat()}');")
    
    conversations.append({
        "id": conv_id,
        "type": ctype,
        "buyer_id": buyer_id,
        "seller_id": seller_id,
        "last_msg_at": last_msg_at
    })

output.append("-- ==================== MESSAGES ====================")
for conv in conversations:
    msg_count = random.randint(4, 12)
    start_time = conv["last_msg_at"] - timedelta(hours=msg_count)
    
    messages = []
    
    if conv["type"] == "nego":
        messages.append((conv["buyer_id"], "text", "Halo kak, masih ada?"))
        messages.append((conv["seller_id"], "text", "Masih kak, silakan"))
        messages.append((conv["buyer_id"], "offer", "Boleh tawar ga kak? Nego tipis nih", random.randint(50000, 150000), "pending"))
        messages.append((conv["seller_id"], "text", "Waduh belum dapet kak kalo segitu"))
        messages.append((conv["buyer_id"], "text", "Yaah, naikin dikit deh"))
    elif conv["type"] == "meetup":
        messages.append((conv["buyer_id"], "text", "Kak besok bisa COD?"))
        messages.append((conv["seller_id"], "text", "Bisa, jam berapa?"))
        messages.append((conv["buyer_id"], "text", "Jam 2 siang di Kantin Barat ya?"))
        messages.append((conv["seller_id"], "text", "Oke sip, kabari aja besok kalo udh nyampe"))
    else:
        messages.append((conv["buyer_id"], "text", "Masih available kak?"))
        messages.append((conv["seller_id"], "text", "Masih ada, kondisi mulus ya tinggal diambil aja"))
        messages.append((conv["buyer_id"], "text", "Bisa COD di Labtek mana aja?"))
        messages.append((conv["seller_id"], "text", "Di depan perpus pusat aja kak"))
        
    # Fill remaining messages
    while len(messages) < msg_count:
        if len(messages) % 2 == 0:
            messages.append((conv["buyer_id"], "text", random.choice(["Oke kak", "Otw kak", "Sip makasi", "Lg dmn kak?"])))
        else:
            messages.append((conv["seller_id"], "text", random.choice(["Ok", "Udh di lokasi ya", "Siaap", "Sama-sama kak"])))
            
    # Generate SQL
    current_time = start_time
    for idx, msg in enumerate(messages):
        current_time += timedelta(minutes=random.randint(5, 60))
        is_read = 'true' if conv["type"] == "old" or idx < len(messages) - 2 else 'false'
        
        if msg[1] == "offer":
            output.append(f"INSERT INTO messages (id, conversation_id, sender_id, content, message_type, offer_price, offer_status, is_read, created_at) VALUES ('{str(uuid.uuid4())}', '{conv['id']}', '{msg[0]}', '{msg[2]}', '{msg[1]}', {msg[3]}, '{msg[4]}', {is_read}, '{current_time.isoformat()}');")
        else:
            output.append(f"INSERT INTO messages (id, conversation_id, sender_id, content, message_type, is_read, created_at) VALUES ('{str(uuid.uuid4())}', '{conv['id']}', '{msg[0]}', '{msg[2]}', '{msg[1]}', {is_read}, '{current_time.isoformat()}');")

with open('supabase/seed_additional.sql', 'w') as f:
    f.write('\n'.join(output))

