class LocalCache {
  // 캐시 만료 시간 설정 (5분)
  static EXPIRE_TIME = 5 * 60 * 1000;

  // 유니크 ID를 데이터에 추가하는 함수
  static addUniqueIds(data) {
    if (data && typeof data === "object" && !Array.isArray(data)) {
      for (const key in data) {
        if (Array.isArray(data[key])) {
          data[key] = data[key].map((item, index) => ({
            ...item,
            id: item.id || `${key}-${index}`,
          }));
        }
      }
    }
    return data;
  }

  // 데이터를 캐시에 저장하는 함수
  static async writeToCache(key, data, expireTime = LocalCache.EXPIRE_TIME) {
    try {
      const cache = await caches.open("sick-cache-v1");
      const expired = new Date().getTime() + expireTime;
      const request = new Request(key);
      const responseData = { data, expired };
      const response = new Response(JSON.stringify(responseData));
      cache.put(request, response);

      // 로컬 스토리지에도 동일한 데이터 저장
      localStorage.setItem(key, JSON.stringify({ data, expired }));
    } catch (error) {
      console.error("데이터 캐싱 중 오류가 발생했습니다:", error);
    }
  }

  // 캐시에서 데이터를 읽어오는 함수
  static async readFromCache(key) {
    try {
      // 로컬 스토리지에서 데이터 읽기
      const localStorageData = localStorage.getItem(key);
      if (localStorageData) {
        const { data, expired } = JSON.parse(localStorageData);
        const now = new Date().getTime();
        if (now < expired) {
          return LocalCache.addUniqueIds(data);
        } else {
          localStorage.removeItem(key);
        }
      }

      // 캐시 API에서 데이터 읽기
      const cache = await caches.open("sick-cache-v1");
      const response = await cache.match(key);
      if (!response) return null;

      const responseData = await response.json();
      const now = new Date().getTime();
      if (now > responseData.expired) {
        cache.delete(key);
        return null;
      }
      return LocalCache.addUniqueIds(responseData.data || {});
    } catch (error) {
      console.error("캐싱 데이터를 읽는 도중 오류가 발생했습니다:", error);
      return null;
    }
  }

  // 캐시된 데이터를 갱신하는 함수
  static async updateCache(key, updateFunc) {
    try {
      const data = await this.readFromCache(key);
      if (!data) return;

      const updatedData = updateFunc(data);
      await this.writeToCache(key, LocalCache.addUniqueIds(updatedData));
    } catch (error) {
      console.error("캐시 업데이트 중 오류가 발생했습니다:", error);
    }
  }
}

export default LocalCache;
