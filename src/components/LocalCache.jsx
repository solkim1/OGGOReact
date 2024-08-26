
// src/components/LocalCache.jsx

const cacheVersion = "v1";
const cacheName = `sick-cache-${cacheVersion}`;

class LocalCache {
  static EXPIRE_TIME = 5 * 60 * 1000; // 캐시 만료 시간 설정 (5분)

  // 인스턴스 메서드로 정의
  async writeToCache(key, data, expireTime = LocalCache.EXPIRE_TIME) {
    try {
      const cache = await caches.open(cacheName);
      const expired = new Date().getTime() + expireTime;
      const request = new Request(key);
      const responseData = { data, expired };
      const response = new Response(JSON.stringify(responseData));
      cache.put(request, response);

      localStorage.setItem(key, JSON.stringify({ data, expired }));
    } catch (error) {
      console.error("데이터 캐싱 중 오류가 발생했습니다:", error);
    }
  }

  // 인스턴스 메서드로 정의
  async readFromCache(key) {
    try {
      const localStorageData = localStorage.getItem(key);
      if (localStorageData) {
        const { data, expired } = JSON.parse(localStorageData);
        const now = new Date().getTime();
        if (now < expired) {
          return data;
        } else {
          localStorage.removeItem(key);
        }
      }

      const cache = await caches.open(cacheName);
      const response = await cache.match(key);
      if (!response) return null;

      const responseData = await response.json();
      const now = new Date().getTime();
      if (now > responseData.expired) {
        cache.delete(key);
        return null;
      }
      return responseData.data || null;
    } catch (error) {
      console.error("캐싱 데이터를 읽는 도중 오류가 발생했습니다:", error);
      return null;
    }
  }
}

export default LocalCache;

