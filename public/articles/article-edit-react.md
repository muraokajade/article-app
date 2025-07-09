# 管理者による記事編集機能を実装する（モーダル機能で素早く反映）

---

## ・管理者画面ボタン表示

![list](/assets/images/article.png)

---

## ・編集ボタン押下でモーダルが出現

![list](/assets/images/modal.png)

---

## 1. ステートと更新関数機能

管理者は記事リスト上から素早く編集モーダルを開き、  
`title`や`content`などを編集・管理できます。  
以下はReact側の編集処理に関する構成です。

```tsx
const [slug, setSlug] = useState("");
const [title, setTitle] = useState("");
const [sectionTitle, setSectionTitle] = useState("");
const [content, setContent] = useState("");
const [imageFile, setImageFile] = useState<File | null>(null);
```
2. 特定記事に基づくGETリクエスト処理
編集前の記事内容を取得するために、管理者トークン付きでaxios.getを使用します。
データベースから得た情報を元にuseStateで管理します。

```tsx
const handleEdit = async (id: number) => {
  if (loading) return;
  try {
    const res = await axios.get(`/api/admin/article/${id}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    const article = res.data;
    setArticle(article);

    // 編集対象の記事情報をステートにセット
    setSlug(article.slug);
    setTitle(article.title);
    setContent(article.content);
    setSectionTitle(article.sectionTitle);

    setIsEditModalOpen(true);
  } catch (err) {
    console.error("❌ 取得失敗", err);
    alert("投稿に失敗しました");
  }
}
```
3. PUTリクエスト処理
編集内容を送信するために、管理者トークン付きでformDataを組み立て、
axios.putを使用します。フォーム送信はFormDataにより行い、
将来的な画像対応にも拡張可能です。

```tsx
const handleUpdate = async (id: number) => {
  try {
    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("title", title);
    formData.append("sectionTitle", sectionTitle);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }
    const res = await axios.put(`/api/admin/article/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    console.log("更新成功:", res.data);
  } catch (e) {
    console.error("更新失敗", e);
  }
};
```
4. 編集モーダルのUI
編集UIはモーダル内に表示され、即時に反映できる構成です。
以下は基本的なUI構造の一例です。

```tsx
<div className="mt-6 border-t pt-4">
  <h3 className="text-xl font-semibold mb-2">記事の編集</h3>

  <input
    className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
    placeholder="タイトル"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <textarea
    className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-2"
    placeholder="本文"
    value={content}
    onChange={(e) => setContent(e.target.value)}
    rows={6}
  />

  <button
    onClick={() => handleUpdate(article?.id || 0)}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  >
    更新する
  </button>
</div>
```
5. データ再取得とモーダルを閉じる
即時にデータを再取得してモーダルを閉じます。

```tsx
const refreshed = await axios.get("/api/admin/articles", {
  headers: {
    Authorization: `Bearer ${idToken}`,
  },
});
setArticles(refreshed.data);
setIsEditModalOpen(false);
```
このように、React側ではデータ取得・ステート管理・PUT送信・UI表示までを明確に分離し、
編集後に即座に画面上へ反映されるUXを実現しています。