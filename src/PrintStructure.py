import os

def print_directory_structure(path, file, indent=0):
    # 遍历给定路径的所有文件和子文件夹
    for item in os.listdir(path):
        item_path = os.path.join(path, item)
        
        if os.path.isdir(item_path):  # 如果是文件夹，递归调用
            file.write(' ' * indent + f".\\{item}\n")
            print_directory_structure(item_path, file, indent + 2)  # 文件夹内容的缩进增加
        else:
            file.write(' ' * indent + item + '\n')  # 写入文件

if __name__ == "__main__":
    # 获取当前路径
    current_path = os.getcwd()
    
    # 打开文件以写入
    with open("directory_structure.txt", "w", encoding="utf-8") as file:
        # 输出文件结构到txt
        print_directory_structure(current_path, file)
    
    print("文件结构已成功输出到 'directory_structure.txt'")
