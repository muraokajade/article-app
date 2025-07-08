import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Link } from "react-router-dom";

export const EditArticleFlowSpring = () => {
  const editDataController = `
    @GetMapping("/article/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticleDTO> getArticle(@RequestHeader(name = "Authorization") String token,
                                                 @PathVariable Long id) {
        firebaseAuthService.verifyAdminAndGetEmail(token);
        ArticleDTO articleDTO = articleService.findById(id);
        return ResponseEntity.ok(articleDTO);
    }
    `;
  const editDataService = `
    public ArticleDTO findById(Long id) {
        ArticleEntity entity =  articleRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("記事が見つかりません。"));
        return convertToDTO(entity);
    }
    `;

  const updaeDataController = `
        @PutMapping("/article/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ArticleDTO> updateArticle(@RequestHeader(name = "Authorization") String token,
                                                    @PathVariable Long id,
                                                    @ModelAttribute ArticleRequest request)
    {
        firebaseAuthService.verifyAdminAndGetEmail(token);
        ArticleDTO articleDTO = articleService.updateArticle(id,request);
        return ResponseEntity.ok(articleDTO);
    }
    `;
  const updateDataServise = `
        public ArticleDTO updateArticle(Long id, ArticleRequest request) {
        //該当記事があるか判定
        ArticleEntity existing = articleRepository.findById(id)
                .orElseThrow(() ->new RuntimeException("記事が存在しません。"));

        //記事が存在していたらEntityに詰める
        existing.setSlug(request.getSlug());
        existing.setSectionTitle(request.getSectionTitle());
        existing.setTitle(request.getTitle());
        existing.setContent(request.getContent());

        String imageUrl = saveImageAndGetUrl(request.getImage());
        existing.setImageUrl(imageUrl);

        ArticleEntity saved = articleRepository.save(existing);
        //DTOにして返却
        return convertToDTO(saved);

    }
    `;
  const convertToDTO = `
        //EntityをDTOにする共通処理
        private ArticleDTO convertToDTO(ArticleEntity entity) {
        return new ArticleDTO(
                entity.getId(),
                entity.getSlug(),
                entity.getTitle(),
                entity.getSectionTitle(),
                entity.getContent(),
                entity.getImageUrl(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.isPublished()
        );
    }
    `;

  return (
    <div className="prose prose-invert max-w-none px-4 py-8">
      <h1 className="text-3xl font-bold">
        Spring Bootで記事編集用データを取得する流れ
      </h1>

      <p>
        管理者が記事を編集する際には、対象の記事データを事前に取得してフォームに表示する必要があります。
        この機能は「IDで記事を検索し、DTOに変換して返す」という構成で実現できます。
      </p>

      <h2 className="text-xl font-semibold mt-8">
        1. Controller層：IDから該当記事を取得
      </h2>
      <p>
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          /article/&#123;id&#125;
        </code>
        というエンドポイントに対して{" "}
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          GET
        </code>{" "}
        リクエストを送ることで、 該当IDの記事データを取得します。このとき、
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          @PreAuthorize
        </code>{" "}
        によって 管理者のみアクセス可能に制限します。
      </p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {editDataController}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">
        2. Service層：Repositoryで検索してDTOに変換
      </h2>
      <p>
        Controllerから呼び出されたService層では、
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          findById
        </code>{" "}
        によって
        リポジトリから記事Entityを検索し、見つかった場合はDTOに変換して返します。見つからない場合は例外を投げます。
      </p>

      <SyntaxHighlighter language="java" style={oneDark}>
        {editDataService}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">
        3. Controller層：更新リクエストを受け取る
      </h2>
      <p>
        管理者が編集フォームから送信した内容を元に、
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          PUT /article/&#123;id&#125;
        </code>{" "}
        のエンドポイントに対して更新処理を行います。
        リクエストには画像を含めるため、
        <code className="font-bold bg-zinc-800 text-green-400 px-1 py-0.5 rounded">
          @ModelAttribute
        </code>{" "}
        を使用して受け取ります。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {updaeDataController}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">
        4. Service層：既存のエンティティを更新し保存
      </h2>
      <p>
        指定されたIDから既存のEntityを取得し、リクエストで送られた内容で更新を行います。
        画像ファイルがある場合は保存し、URLを再設定します。
        最終的に保存されたEntityをDTOに変換して返します。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {updateDataServise}
      </SyntaxHighlighter>

      <h2 className="text-xl font-semibold mt-8">
        5. DTO変換処理：Entityをクライアント返却用に整形
      </h2>
      <p>
        Service層では更新後のEntityをフロントエンドに返すため、
        専用のDTO変換メソッドを通じて整形します。
      </p>
      <SyntaxHighlighter language="java" style={oneDark}>
        {convertToDTO}
      </SyntaxHighlighter>
      <Link to="/articles/article-edit-react">
        <p className="text-blue-400 text-lg mt-4">Reactの説明を見る</p>
      </Link>
      <Link to="/tech">
        <p className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition duration-200">
          技術記事一覧に戻る
        </p>
      </Link>
    </div>
  );
};
