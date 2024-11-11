import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Card from "@/components/Card";
import Notifications from "@/components/notificationsModal";
import { useNavigation } from "@react-navigation/native";
import { PostType } from "@/utils/models/postModel";
import { fetchPosts } from "@/utils/interfaces/postInterface";
import { getToken } from "../../firebase";
import { debounce } from "lodash";

interface FilterState {
  minPrice: string;
  maxPrice: string;
}

const MarketplacePage = () => {
  const [notificationsModalVisible, setNotificationsVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
  });
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    const checkFocus = () => {
      setIsFocused(navigation.isFocused());
    };
    checkFocus();
    navigation.addListener("focus", checkFocus);
    navigation.addListener("blur", checkFocus);
    return () => {
      navigation.removeListener("focus", checkFocus);
      navigation.removeListener("blur", checkFocus);
    };
  }, [navigation]);

  const fetchUserData = async (search?: string, filters?: FilterState) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await getToken();
      const fetchedPosts = await fetchPosts(
        token!,
        search,
        undefined, // color
        undefined, // user_firebase_id
        filters?.minPrice ? Number(filters.minPrice) : undefined,
        filters?.maxPrice ? Number(filters.maxPrice) : undefined
      );
      setPosts(fetchedPosts);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = debounce((query: string) => {
    fetchUserData(query, activeFilters);
  }, 500);

  useEffect(() => {
    if (isFocused) {
      debouncedSearch(searchQuery);
    }
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, isFocused, activeFilters]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleApplyFilters = () => {
    setActiveFilters(filters);
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      minPrice: "",
      maxPrice: "",
    };
    setFilters(resetFilters);
    setActiveFilters(resetFilters);
    setFilterModalVisible(false);
  };

  const hasActiveFilters = activeFilters.minPrice || activeFilters.maxPrice;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons
              name="filter"
              size={24}
              color={hasActiveFilters ? "#F4A71D" : "black"}
            />
            {hasActiveFilters && <View style={styles.filterBadge} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setNotificationsVisible(true)}>
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search marketplace..."
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery("")}
          >
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <Text style={styles.activeFiltersText}>
            Filters:{" "}
            {[
              activeFilters.minPrice && `Min $${activeFilters.minPrice}`,
              activeFilters.maxPrice && `Max $${activeFilters.maxPrice}`,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
          <TouchableOpacity onPress={handleResetFilters}>
            <Text style={styles.clearFiltersText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchUserData(searchQuery, activeFilters)}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.cardContainer}>
            {posts.length > 0 ? (
              posts.map((item) => (
                <Card key={item.post_id} {...item} page="marketplace" />
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No items found</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.priceInputContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceLabel}>Min</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="$0"
                    value={filters.minPrice}
                    onChangeText={(text) =>
                      setFilters((prev) => ({ ...prev, minPrice: text }))
                    }
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.priceSeparator} />
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceLabel}>Max</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChangeText={(text) =>
                      setFilters((prev) => ({ ...prev, maxPrice: text }))
                    }
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleResetFilters}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <Notifications
        modalVisible={notificationsModalVisible}
        setModalVisible={setNotificationsVisible}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterButton: {
    position: "relative",
  },
  filterBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#F4A71D",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#f1f1f1",
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  activeFiltersContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
  },
  activeFiltersText: {
    fontSize: 14,
    color: "#666",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#F4A71D",
  },
  scrollContent: {
    flexGrow: 1,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInputWrapper: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  priceSeparator: {
    width: 16,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginTop: 24,
  },
  resetButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F4A71D",
    alignItems: "center",
  },
  resetButtonText: {
    color: "#F4A71D",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F4A71D",
    alignItems: "center",
  },
  applyButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MarketplacePage;
