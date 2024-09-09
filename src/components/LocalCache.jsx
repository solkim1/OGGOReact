class LocalCache {
  // 캐시 만료 시간 설정 (5분)
  static EXPIRE_TIME = 5 * 60 * 1000;

  /**
   * 객체 데이터에 고유 ID를 추가하는 메서드.
   *
   * @param {Object} data - 고유 ID가 추가될 객체 데이터.
   * @return {Object} 고유 ID가 추가된 데이터 객체를 반환.
   */
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

  /**
   * 데이터를 캐시에 쓰는 메서드.
   * 데이터는 캐시 스토리지 및 로컬 스토리지에 저장됩니다.
   *
   * @param {string} key - 캐시 키.
   * @param {Object} data - 캐시할 데이터.
   * @param {number} [expireTime=LocalCache.EXPIRE_TIME] - 만료 시간(기본값: 5분).
   */
  static async writeToCache(key, data, expireTime = LocalCache.EXPIRE_TIME) {
    try {
      const cache = await caches.open("sick-cache-v1");
      const expired = new Date().getTime() + expireTime;
      const request = new Request(key);
      const responseData = { data, expired };
      const response = new Response(JSON.stringify(responseData));
      cache.put(request, response);

      localStorage.setItem(key, JSON.stringify({ data, expired }));
    } catch (error) {
      console.error("Error writing to cache:", error);
    }
  }

  /**
   * 캐시로부터 데이터를 읽는 메서드.
   * 데이터가 만료되지 않았을 경우 캐시에서 데이터를 가져옵니다.
   *
   * @param {string} key - 읽을 캐시 키.
   * @return {Promise<Object|null>} 캐시된 데이터를 반환하거나 만료된 경우 null을 반환.
   */
  static async readFromCache(key) {
    try {
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
      console.error("Error reading from cache:", error);
      return null;
    }
  }

  /**
   * 캐시를 업데이트하는 메서드.
   * 주어진 업데이트 함수를 사용하여 캐시된 데이터를 수정합니다.
   *
   * @param {string} key - 업데이트할 캐시 키.
   * @param {function} updateFunc - 데이터를 업데이트할 함수.
   */
  static async updateCache(key, updateFunc) {
    try {
      const data = await this.readFromCache(key);
      if (!data) return;

      const updatedData = updateFunc(data);
      await this.writeToCache(key, LocalCache.addUniqueIds(updatedData));
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  }

  /**
   * 캐시와 로컬 스토리지에서 특정 데이터를 삭제하는 메서드.
   *
   * @param {string} key - 삭제할 캐시 키.
   */
  static async deleteCache(key) {
    try {
      const cache = await caches.open("sick-cache-v1");
      await cache.delete(key);
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error deleting cache:", error);
    }
  }

  /**
   * 모든 캐시와 로컬 스토리지를 지우는 메서드.
   */
  static async clearAllCache() {
    try {
      const cache = await caches.open("sick-cache-v1");
      const keys = await cache.keys();
      for (const key of keys) {
        await cache.delete(key);
      }
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing all caches:", error);
    }
  }

  /**
   * 'userMode'를 제외한 모든 캐시와 로컬 스토리지 항목을 지우는 메서드.
   */
  static async clearAllExceptBusiness() {
    try {
      const cache = await caches.open("sick-cache-v1");
      const keys = await cache.keys();

      // 'isBusiness' 값을 제외한 모든 캐시 삭제
      for (const key of keys) {
        if (key.url.includes("isBusiness")) continue; // isBusiness 키는 삭제하지 않음
        await cache.delete(key);
      }

      // 로컬 스토리지에서 'userMode'만 남기고 삭제
      Object.keys(localStorage).forEach((key) => {
        if (key !== "userMode") {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing all caches except 'isBusiness':", error);
    }
  }
}

export default LocalCache;
