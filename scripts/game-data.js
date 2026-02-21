// 游戏数据处理脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 从data.json加载数据
  fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      // 初始化函数
      function init() {
        loadFeaturedGames(data);
        loadLatestGames(data);
        loadCategoryGames(data);
        loadRelatedGames(data);
        loadTags(data);
      }

      // 加载首页推荐游戏
      function loadFeaturedGames(gamesData) {
        const container = document.querySelector('.featured-games .games-grid');
        if (container) {
          container.innerHTML = '';
          gamesData.featured.forEach(game => {
            container.innerHTML += createGameCard(game);
          });
        }
      }

      // 加载最新游戏
      function loadLatestGames(gamesData) {
        const container = document.querySelector('.latest-games .games-grid');
        if (container) {
          container.innerHTML = '';
          gamesData.latest.forEach(game => {
            container.innerHTML += createGameCard(game);
          });
        }
      }

      // 加载分类游戏
      function loadCategoryGames(gamesData) {
        // 根据当前页面路径确定分类
        const path = window.location.pathname;
        let categoryData = null;

        if (path.includes('2player')) {
          categoryData = gamesData.twoPlayer;
        } else if (path.includes('baseball')) {
          categoryData = gamesData.baseball;
        } else if (path.includes('basketball')) {
          categoryData = gamesData.basketball;
        }

        if (categoryData) {
          const container = document.querySelector('.games-section .games-grid');
          if (container) {
            container.innerHTML = '';
            // 只显示前28个游戏
            const displayGames = categoryData.slice(0, 28);
            displayGames.forEach(game => {
              container.innerHTML += createGameCard(game);
            });
          }

          // 处理分页显示
          const paginationContainer = document.getElementById('pagination-container');
          if (paginationContainer) {
            if (categoryData.length > 28) {
              // 游戏数量超过28个，显示分页
              paginationContainer.style.display = 'flex';
              paginationContainer.innerHTML = generatePagination(categoryData.length, 28);
            } else {
              // 游戏数量不超过28个，隐藏分页
              paginationContainer.style.display = 'none';
            }
          }
        }
      }

      // 加载相关推荐游戏
      function loadRelatedGames(gamesData) {
        const container = document.querySelector('.related-games .games-grid');
        if (container) {
          container.innerHTML = '';
          gamesData.related.forEach(game => {
            container.innerHTML += createGameCard(game);
          });
        }
      }

      // 加载游戏标签
      function loadTags(gamesData) {
        const container = document.querySelector('.tags-section .games-grid');
        if (container) {
          container.innerHTML = '';
          // 只显示前28个标签
          const displayTags = gamesData.tags.slice(0, 28);
          displayTags.forEach(tag => {
            container.innerHTML += createTagCard(tag);
          });
        }

        // 处理分页显示
        const paginationContainer = document.getElementById('pagination-container');
        if (paginationContainer) {
          if (gamesData.tags.length > 28) {
            // 标签数量超过28个，显示分页
            paginationContainer.style.display = 'flex';
            paginationContainer.innerHTML = generatePagination(gamesData.tags.length, 28);
          } else {
            // 标签数量不超过28个，隐藏分页
            paginationContainer.style.display = 'none';
          }
        }
      }

      // 创建游戏卡片HTML
      function createGameCard(game) {
        return `
          <div class="game-card">
            <div class="game-card-img">
              <img src="${game.image}" alt="${game.name}">
            </div>
            <div class="game-card-info">
              <h3>${game.name}</h3>
              <p class="game-card-category">${game.category}</p>
              <p class="game-card-rating">★★★★★ ${game.rating}</p>
            </div>
          </div>
        `;
      }

      // 创建标签卡片HTML
      function createTagCard(tag) {
        return `
          <div class="game-card">
            <div class="game-card-img">
              <img src="${tag.image}" alt="${tag.name}">
            </div>
            <div class="game-card-info">
              <h3>${tag.name}</h3>
              <p class="game-card-category">${tag.category}</p>
              <p class="game-card-rating">${tag.count} 游戏</p>
            </div>
          </div>
        `;
      }

      // 生成分页HTML
      function generatePagination(totalItems, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        let paginationHTML = '<a href="#">上一页</a>';

        // 生成分页链接
        for (let i = 1; i <= Math.min(totalPages, 3); i++) {
          paginationHTML += `<a href="#" ${i === 1 ? 'class="active"' : ''}>${i}</a>`;
        }

        // 添加省略号和最后一页
        if (totalPages > 3) {
          paginationHTML += '<span class="ellipsis">...</span>';
          paginationHTML += `<a href="#">${totalPages}</a>`;
        }

        paginationHTML += '<a href="#">下一页</a>';
        return paginationHTML;
      }

      // 初始化
      init();
    })
    .catch(error => console.error('加载游戏数据失败:', error));
});

// 搜索功能
function searchGames(query) {
  return fetch('data/data.json')
    .then(response => response.json())
    .then(data => {
      const allGames = [
        ...data.featured,
        ...data.latest,
        ...data.twoPlayer,
        ...data.baseball,
        ...data.basketball
      ];

      return allGames.filter(game => {
        return game.name.toLowerCase().includes(query.toLowerCase()) ||
               game.category.toLowerCase().includes(query.toLowerCase());
      });
    })
    .catch(error => {
      console.error('加载游戏数据失败:', error);
      return [];
    });
}